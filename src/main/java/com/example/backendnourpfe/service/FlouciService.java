package com.example.backendnourpfe.service;



import com.example.backendnourpfe.Respository.*;
import com.example.backendnourpfe.classes.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.mail.MessagingException;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import okhttp3.MediaType;
import java.io.*;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;

import okhttp3.*;
@RequiredArgsConstructor
@Service
public class FlouciService {

    private final EmailService emailService;
    private final UtilisateurRepository utilisateurRepository;
    private final PaymentRepository paymentRepository;
    private final ReservationRepository reservationRepository;
    private final PaymentAbonnementRepository paymentAbonnementRepository;
    private final AbonnementRepository abonnementRepository;
    @Value("${flouci.public-token}")
    public String publicToken;

    @Value("${flouci.private-token}")
    public String privateToken;

    public String createPaymentForReservation(Float amount, Long reservationId) throws IOException {

        OkHttpClient client = new OkHttpClient();
        MediaType mediaType = MediaType.parse("application/json; charset=utf-8");


        Reservation reservation = reservationRepository.findById(reservationId).orElse(null);
        if (reservation == null) {
            return "Reservation not found!";
        }


        Utilisateur particulier = reservation.getParticulier();
        Utilisateur prestataire = reservation.getPrestataire();
        String jsonBody = "{\n" +
                "  \"app_token\": \"" + publicToken + "\",\n" +
                "  \"app_secret\": \"" + privateToken + "\",\n" +
                "  \"accept_card\": true,\n" +
                "  \"amount\": " + amount + ",\n" +
                "  \"session_timeout_secs\": 1200,\n" +
                "  \"success_link\": \"http://localhost:4200/Front\",\n" +
                "  \"fail_link\": \"http://localhost:4200/fail\",\n" +
                "  \"developer_tracking_id\": \"27fa1c98-347a-400c-99df-0db9b1cf7b83\"\n" +
                "}";

        RequestBody body = RequestBody.create(mediaType, jsonBody);


        Request request = new Request.Builder()
                .url("https://developers.flouci.com/api/generate_payment")
                .post(body)
                .addHeader("Content-Type", "application/json")
                .build();


        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("Unexpected code " + response);
            }

            String responseString = response.body().string();


            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(responseString);
            JsonNode resultNode = rootNode.path("result");


            String paymentId = resultNode.path("payment_id").asText();
            String redirectUrl = resultNode.path("link").asText();
            boolean success = resultNode.path("success").asBoolean();


            Payment payment = new Payment();
            payment.setAmount(amount);
            payment.setReservation(reservation);
            payment.setParticulier(particulier);
            payment.setPrestataire(prestataire);
            payment.setPaymentId(paymentId);
            payment.setModePaiement("FLOUCI");

            payment.setPaymentStatus(success ? StatusPayment.SUCCESS : StatusPayment.FAILED);


            reservation.setStatusReservation(StatusReservation.TERMINE);

            Float currentSolde = prestataire.getSolde();
            if (currentSolde == null) {
                currentSolde = 0.0f;
            }


            prestataire.setSolde(currentSolde + amount);
            utilisateurRepository.save(prestataire);
            paymentRepository.save(payment);


            return responseString;
        }
    }


    public String verifyPayment(String paymentId) throws IOException {
        OkHttpClient client = new OkHttpClient();


        String url = "https://developers.flouci.com/api/verify_payment/" + paymentId;


        Request request = new Request.Builder()
                .url(url)
                .get()
                .addHeader("Content-Type", "application/json")
                .addHeader("apppublic", publicToken)
                .addHeader("appsecret", privateToken)
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("Erreur lors de la vérification du paiement : " + response);
            }

            String responseString = response.body().string();


            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(responseString);

            boolean isSuccess = root.path("success").asBoolean(false);


            Payment payment = paymentRepository.findByPaymentId(paymentId);
            if (payment == null) {
                throw new RuntimeException("Paiement non trouvé pour l'ID : " + paymentId);
            }


            if (isSuccess) {
                payment.setPaymentStatus(StatusPayment.SUCCESS);
            } else {
                payment.setPaymentStatus(StatusPayment.FAILED);
            }

            paymentRepository.save(payment);

            return responseString;
        }
    }

    public String createPaymentForReservationEspace(Float amount, Long reservationId) throws IOException {


        Reservation reservation = reservationRepository.findById(reservationId).orElse(null);
        if (reservation == null) {
            return "Reservation not found!";
        }

        Utilisateur particulier = reservation.getParticulier();
        Utilisateur prestataire = reservation.getPrestataire();


        Payment payment = new Payment();
        payment.setAmount(amount);
        payment.setReservation(reservation);
        payment.setParticulier(particulier);
        payment.setPrestataire(prestataire);
        payment.setModePaiement("ESPACE");
        payment.setPaymentStatus(StatusPayment.SUCCESS);

        reservation.setStatusReservation(StatusReservation.TERMINE);
        Float currentSolde = prestataire.getSolde();
        if (currentSolde == null) {
            currentSolde = 0.0f;
        }


        prestataire.setSolde(currentSolde + amount);
        utilisateurRepository.save(prestataire);

        paymentRepository.save(payment);
        reservationRepository.save(reservation);

        return "Paiement effectué avec succès";
    }

    public List<Payment> getPaymentsByUser(Long userId) {
        return paymentRepository.findByParticulierIdUtilisateurOrPrestataireIdUtilisateur(userId, userId);
    }

    public String createPaymentForAbonnement(String email, TypeAbonnement type) throws IOException {

        Optional<Utilisateur> user = utilisateurRepository.findByEmail(email);
        if (user == null) return "Utilisation introuvable";

        Float montant = switch (type) {
            case GRATUIT -> 0f;
            case MENSUEL -> 20f;
            case ANNUEL -> 120f;
        };

        // Créer un nouvel abonnement
        Abonnement abonnement = new Abonnement();
        abonnement.setUtilisateur((user.get()));
        abonnement.setTypeAbonnement(type);
        abonnement.setDateDebut(new Date());
        abonnement.setDateFin(
                switch (type) {
                    case GRATUIT -> java.sql.Date.valueOf(LocalDate.now().plusWeeks(1));
                    case MENSUEL -> java.sql.Date.valueOf(LocalDate.now().plusMonths(1));
                    case ANNUEL -> java.sql.Date.valueOf(LocalDate.now().plusYears(1));
                }
        );
        abonnement.setMontant(montant);
        if (type == TypeAbonnement.GRATUIT) {
            abonnement.setStatusAbonnement(StatusAbonnement.ACTIF);

            Utilisateur u = user.get();
            u.setStatus(StatusUtilisateur.ACCEPTE);
            utilisateurRepository.save(u);

            abonnementRepository.save(abonnement);

            return "GRATUIT"; // ou un message spécifique pour le front
        }
        abonnement.setStatusAbonnement(StatusAbonnement.EN_ATTENTE);
        abonnementRepository.save(abonnement);

        // Préparer appel API Flouci
        OkHttpClient client = new OkHttpClient();
        MediaType mediaType = MediaType.parse("application/json; charset=utf-8");
        int amountInMillimes = Math.round(montant * 1000);

        String jsonBody = "{\n" +
                "  \"app_token\": \"" + publicToken + "\",\n" +
                "  \"app_secret\": \"" + privateToken + "\",\n" +
                "  \"accept_card\": true,\n" +
                "  \"amount\": " + amountInMillimes + ",\n" +
                "  \"session_timeout_secs\": 1200,\n" +
                "  \"success_link\": \"http://localhost:4200/Front\",\n" +
                "  \"fail_link\": \"http://localhost:4200/fail\",\n" +
                "  \"developer_tracking_id\": \"27fa1c98-347a-400c-99df-0db9b1cf7b83\"\n" +
                "}";

        System.out.println("JSON envoyé à Flouci:\n" + jsonBody); // pour debug

        RequestBody body = RequestBody.create(mediaType, jsonBody);

        Request request = new Request.Builder()
                .url("https://developers.flouci.com/api/generate_payment")
                .post(body)
                .addHeader("Content-Type", "application/json")
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("Erreur lors de la création du paiement : " + response);
            }

            String responseString = response.body().string();

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(responseString);
            JsonNode resultNode = rootNode.path("result");

            String paymentId = resultNode.path("payment_id").asText();
            boolean success = resultNode.path("success").asBoolean();

            PaymentAbonnement payment = new PaymentAbonnement();
            payment.setAmount(montant);
            payment.setPaymentStatus(success ? StatusPayment.SUCCESS : StatusPayment.FAILED);
            payment.setPaymentId(paymentId);
            payment.setAbonnement(abonnement);

            paymentAbonnementRepository.save(payment);

            String redirectUrl = resultNode.path("link").asText();

            if (redirectUrl == null || redirectUrl.isEmpty()) {
                throw new IOException("URL de redirection manquante dans la réponse Flouci.");
            }

            return redirectUrl;

        }
    }

    public void activerGratuit(String email) {
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        Abonnement abonnement = new Abonnement();
        abonnement.setTypeAbonnement(TypeAbonnement.GRATUIT);
        abonnement.setDateDebut(new Date());
        abonnement.setDateFin(Date.from(LocalDate.now().plusWeeks(1).atStartOfDay(ZoneId.systemDefault()).toInstant()));
        abonnement.setStatusAbonnement(StatusAbonnement.ACTIF);
        abonnement.setMontant(0f);
        abonnement.setUtilisateur(utilisateur);

        abonnementRepository.save(abonnement);

        utilisateur.setStatus(StatusUtilisateur.ACCEPTE);
        utilisateurRepository.save(utilisateur);
    }

    public String verifyPaymentAbonnement(String paymentId) throws IOException {
        OkHttpClient client = new OkHttpClient();

        String url = "https://developers.flouci.com/api/verify_payment/" + paymentId;

        Request request = new Request.Builder()
                .url(url)
                .get()
                .addHeader("Content-Type", "application/json")
                .addHeader("apppublic", publicToken)
                .addHeader("appsecret", privateToken)
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("Erreur lors de la vérification du paiement : " + response);
            }

            String responseString = response.body().string();
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(responseString);

            boolean isSuccess = root.path("success").asBoolean(false);


            PaymentAbonnement paymentAbonnement = paymentAbonnementRepository.findByPaymentId(paymentId);
            if (paymentAbonnement == null) {
                throw new RuntimeException("Paiement abonnement non trouvé pour l'ID : " + paymentId);
            }


            paymentAbonnement.setPaymentStatus(isSuccess ? StatusPayment.SUCCESS : StatusPayment.FAILED);
            paymentAbonnementRepository.save(paymentAbonnement);

            if (isSuccess) {
                Abonnement abonnement = paymentAbonnement.getAbonnement();
                abonnement.setStatusAbonnement(StatusAbonnement.ACTIF);


                Utilisateur user = abonnement.getUtilisateur();
                user.setStatus(StatusUtilisateur.ACCEPTE);

                abonnementRepository.save(abonnement);
                utilisateurRepository.save(user);
            }

            return responseString;

        }
    }

    public void envoyerEmailBienvenue(String toEmail) throws MessagingException {
        Utilisateur utilisateur = utilisateurRepository.findByEmail(toEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec cet email"));

        String nomUtilisateur = utilisateur.getNom();
        String subject = "Bienvenue sur SOS Service Tunisie !";
        String lienAbonnement = "http://localhost:4200/abonnementpaye";

        String emailContent = "<div style=\"background-color:#fbf5f5; padding:20px; border-radius:10px; font-family:Arial, sans-serif;\">"
                + "<h3 style=\"color:#333; text-align:center;\">Bienvenue sur notre plateforme !</h3>"
                + "<p>Bonjour <strong>" + nomUtilisateur + "</strong>,</p>"
                + "<p>Nous avons le plaisir de vous informer que votre candidature a été <strong>acceptée</strong>.</p>"
                + "<p>Vous pouvez désormais accéder à la plateforme et commencer à proposer vos services.</p>"
                + "<p>Pour activer votre compte, merci de choisir un type d’abonnement et de procéder au paiement via Flouci :</p>"

                + "<div style=\"text-align:center; margin-top:20px;\">"
                + "<a href=\"" + lienAbonnement + "\" target=\"_blank\" " + "style=\"display:inline-block; padding:10px 20px; background-color:#28a745; color:#ffffff; text-decoration:none; border-radius:5px; font-weight:bold;\">"
                + "🔐 Choisir un abonnement"
                + "</a>"
                + "</div>"

                + "<p style=\"margin-top:30px;\">Si vous avez des questions ou rencontrez des difficultés, n'hésitez pas à nous contacter :</p>"
                + "<ul>"
                + "<li>Email : <a href=\"mailto:support@sosservice.tn\">support@sosservice.tn</a></li>"
                + "<li>Téléphone : <a href=\"tel:+21612345678\">+216 12 345 678</a></li>"
                + "</ul>"

                + "<br>"
                + "<p>Cordialement,<br><strong>L'équipe SOS Service Tunisie.</strong></p>"
                + "</div>";

        emailService.sendHtmlEmail(toEmail, subject, emailContent);
    }

    @Scheduled(cron = "0 42 6 * * ?")
    public void verifierAbonnementsExpirés() {
        Date now = new Date();
        System.out.println("==> Vérification des abonnements à : " + now);

        List<Abonnement> abonnements = abonnementRepository.findAll();

        for (Abonnement abonnement : abonnements) {
            Date dateFin = abonnement.getDateFin();

            if (dateFin != null) {
                System.out.println("---- Abonnement ID : " + abonnement.getIdAbonnement() + " ----");
                System.out.println("Date de fin       : " + dateFin);
                System.out.println("Statut actuel     : " + abonnement.getStatusAbonnement());

                // Calculer la date 1 jour avant la date de fin
                Calendar cal = Calendar.getInstance();
                cal.setTime(dateFin);
                cal.add(Calendar.DAY_OF_MONTH, -1);
                Date unJourAvant = cal.getTime();

                // Cas 1 : Préavis (1 jour avant expiration)
                if (!now.before(unJourAvant) && now.before(dateFin)) {
                    System.out.println("Préavis de fin d’abonnement envoyé.");

                    String email = abonnement.getUtilisateur().getEmail();
                    String nom = abonnement.getUtilisateur().getNom();

                    String dateFinFormatted = new SimpleDateFormat("dd/MM/yyyy").format(dateFin);
                    String lienAbonnement = "http://localhost:4200/abonnementpaye";

                    envoyerEmailRenouvellement(email, nom, dateFinFormatted, lienAbonnement);
                }

                // Cas 2 : Expiré
                else if (!now.before(dateFin)) {
                    if (abonnement.getStatusAbonnement() != StatusAbonnement.EXPIRE) {
                        System.out.println("L’abonnement est expiré. Mise à jour du statut...");

                        abonnement.setStatusAbonnement(StatusAbonnement.EXPIRE);
                        abonnement.getUtilisateur().setStatus(StatusUtilisateur.NONPAYE);

                        abonnementRepository.save(abonnement);
                        utilisateurRepository.save(abonnement.getUtilisateur());

                        String email = abonnement.getUtilisateur().getEmail();
                        String nom = abonnement.getUtilisateur().getNom();

                        String dateFinFormatted = new SimpleDateFormat("dd/MM/yyyy").format(dateFin);
                        String lienAbonnement = "http://localhost:4200/abonnementpaye";

                        envoyerEmailRenouvellement(email, nom, dateFinFormatted, lienAbonnement);
                    } else {
                        System.out.println("Déjà expiré, aucune action.");
                    }
                } else {
                    System.out.println("Aucune action requise pour cet abonnement.");
                }
            }
        }
    }


    private void envoyerEmailRenouvellement(String email, String nomUtilisateur, String dateFin, String lienAbonnement) {
        String abonnmeny = "http://localhost:4200/abonnementpaye";
        try {

            String subject = "Votre abonnement a expiré!";
            String emailContent = "<div style=\"background-color:#fbf5f5; padding:20px; border-radius:10px; font-family:Arial, sans-serif;\">"
                    + "<h3 style=\"color:#c0392b; text-align:center;\">Votre abonnement a expiré</h3>"
                    + "<p>Bonjour <strong>" + nomUtilisateur + "</strong>,</p>"
                    + "<p>Nous vous informons que votre abonnement est arrivé à <strong>expiration</strong> le <strong>" + dateFin + "</strong>.</p>"
                    + "<p>Pour continuer à bénéficier de nos services, merci de renouveler votre abonnement en cliquant sur le bouton ci-dessous :</p>"

                    + "<div style=\"text-align:center; margin-top:20px;\">"
                    + "<a href=\"" + abonnmeny + "\" target=\"_blank\" "
                    + "style=\"display:inline-block; padding:10px 20px; background-color:#007bff; color:#ffffff; text-decoration:none; border-radius:5px; font-weight:bold;\">"
                    + "🔄 Renouveler mon abonnement"
                    + "</a>"
                    + "</div>"

                    + "<p style=\"margin-top:30px;\">Sans renouvellement, votre compte restera temporairement désactivé.</p>"
                    + "<p>Pour toute assistance, contactez-nous :</p>"
                    + "<ul>"
                    + "<li>Email : <a href=\"mailto:support@sosservice.tn\">support@sosservice.tn</a></li>"
                    + "<li>Téléphone : <a href=\"tel:+21612345678\">+216 12 345 678</a></li>"
                    + "</ul>"

                    + "<br>"
                    + "<p>Cordialement,<br><strong>L'équipe SOS Service Tunisie.</strong></p>"
                    + "</div>";

            emailService.sendHtmlEmail(email,subject , emailContent);
        } catch (Exception e) {
            System.out.println("Erreur lors de l'envoi du mail : " + e.getMessage());
        }
    }


    public boolean aDejaUtiliseGratuit(String email) {
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        return abonnementRepository.existsByUtilisateurAndTypeAbonnement(utilisateur, TypeAbonnement.GRATUIT);
    }


}

