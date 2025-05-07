package com.example.backendnourpfe.service;



import com.example.backendnourpfe.Respository.PaymentRepository;
import com.example.backendnourpfe.Respository.ReservationRepository;
import com.example.backendnourpfe.Respository.UtilisateurRepository;
import com.example.backendnourpfe.classes.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import okhttp3.MediaType;
import java.io.*;
import java.util.List;

import okhttp3.*;
@Service
public class FlouciService {
    @Autowired
    private UtilisateurRepository utilisateurRepository;
    @Autowired
    private PaymentRepository paymentRepository;
    @Autowired
    private ReservationRepository reservationRepository;
    @Value("${flouci.public-token}")
    private String publicToken;

    @Value("${flouci.private-token}")
    private String privateToken;


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

}