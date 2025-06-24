package com.example.backendnourpfe.service;

import com.example.backendnourpfe.Respository.DemandeRepository;
import com.example.backendnourpfe.Respository.ReservationRepository;
import com.example.backendnourpfe.Respository.UtilisateurRepository;
import com.example.backendnourpfe.classes.*;
import com.example.backendnourpfe.interfacee.ReservationInterface;
import jakarta.mail.MessagingException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Optional;
@RequiredArgsConstructor
@Service
public class ReservationService implements ReservationInterface {
    private final ReservationRepository reservationRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final DemandeRepository demandeRepository;
    private final EmailService emailService;



    @Transactional
    public Reservation creerReservation(Long idParticulier, Long idPrestataire, Long idDemande, Reservation reservation) throws MessagingException {


        Utilisateur particulier = utilisateurRepository.findById(idParticulier)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        Utilisateur prestataire = utilisateurRepository.findById(idPrestataire)
                .orElseThrow(() -> new RuntimeException("Prestataire non trouvé"));

        Demande demande = demandeRepository.findById(idDemande)
                .orElseThrow(() -> new RuntimeException("Demande non trouvée"));


        if (particulier.getRole() != UserRole.PARTICULIER) {
            throw new RuntimeException("Seul un utilisateur avec le rôle 'Particulier' peut réserver.");
        }

        if (prestataire.getRole() != UserRole.PRESTATAIRE && prestataire.getRole() != UserRole.ENTREPRISE) {
            throw new RuntimeException("L'utilisateur cible doit être un prestataire ou une entreprise.");
        }


        boolean reservationExiste = reservationRepository.existsByPrestataireAndDemande(prestataire, demande);
        if (reservationExiste) {
            throw new RuntimeException("Ce prestataire est déjà réservé pour cette demande.");
        }


        reservation.setParticulier(particulier);
        reservation.setPrestataire(prestataire);
        reservation.setDateReservation(new Date());
        reservation.setStatusReservation(StatusReservation.EN_ATTENTE);
        reservation.setDemande(demande);

        Reservation reservationSauvegardee = reservationRepository.save(reservation);

        String confirmationUrl = "http://localhost:8088/nour/reservation/confirmer/" + reservationSauvegardee.getIdReservation();
        String refusalUrl = "http://localhost:8088/nour/reservation/refuser/" + reservationSauvegardee.getIdReservation();

        String emailContent = "<div style=\"background-color:#fbf5f5; padding:20px; border-radius:10px; font-family:Arial, sans-serif;\">"
                + "<h3 style=\"color:#333; text-align:center;\">Réservation de votre service</h3>"
                + "<p>Bonjour <strong>" + prestataire.getNom() + "</strong>,</p>"
                + "<p><strong>" + particulier.getNom() + "</strong> a réservé votre service pour la demande suivante :</p>"
                + "<p><strong>Service demandé :</strong> " + demande.getServicee().getNomservice() + "</p>"
                + "<p><strong>Particulier :</strong> " + particulier.getNom() + "</p>"
                + "<p><strong>Date de la demande :</strong> " + demande.getDate() + "</p>"
                + "<p><strong>Durée estimée :</strong> " + demande.getHeureTravail() + " heures</p>"
                + "<p><strong>Description du service :</strong> " + demande.getDescription() + "</p>"
                + "<p style=\"margin-bottom:20px;\">Le particulier attend maintenant votre confirmation pour procéder à la réservation.</p>"
                + "<div style=\"text-align:center;\">"
                + "<a href=\"" + confirmationUrl + "\" style=\"display:inline-block; padding:10px 20px; background-color:#28a745; color:#ffffff; text-decoration:none; border-radius:5px; margin-right:10px; font-weight:bold;\">✅ Confirmer</a>"
                + "<a href=\"" + refusalUrl + "\" style=\"display:inline-block; padding:10px 20px; background-color:#dc3545; color:#ffffff; text-decoration:none; border-radius:5px; font-weight:bold;\">❌ Refuser</a>"
                + "</div>"
                + "<br><p>Cordialement,<br><strong>L'équipe SOS Service Tunisie.</strong></p>"
                + "</div>";

        emailService.envoyerEmailConfirmation(prestataire.getEmail(), "Nouvelle demande de réservation", emailContent);

        return reservationSauvegardee;
    }

    public Reservation confirmerReservation(Long idReservation) {

        Reservation reservation = reservationRepository.findById(idReservation)
                .orElseThrow(() -> new RuntimeException("Réservation non trouvée"));

        if (reservation.getStatusReservation() != StatusReservation.EN_ATTENTE) {
            throw new RuntimeException("La réservation n'est pas en attente.");
        }


        reservation.setStatusReservation(StatusReservation.CONFORME);


        Demande demande = reservation.getDemande();
        demande.setStatusDemande(StatusDemande.TERMINE);


        reservationRepository.save(reservation);
        demandeRepository.save(demande);


        return reservation;
    }

    public void refuserReservation(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Réservation non trouvée"));


        reservation.setStatusReservation(StatusReservation.EN_ATTENTE);
        reservationRepository.save(reservation);


    }
    public List<Reservation> getReservationsEnAttenteParParticulier(Long idParticulier) {
        return reservationRepository.findEnAttenteByParticulier(idParticulier);
    }


    public List<Reservation> getReservationsByDemandeId(Long idDemande) {
        return reservationRepository.findByDemandeIdDemandeAndStatusReservation(idDemande,StatusReservation.CONFORME);

    }
    public List<Reservation> getReservationsTermineesByParticulier(Long idUtilisateur) {
        return reservationRepository.findByStatusReservationAndParticulier_IdUtilisateur(StatusReservation.TERMINE, idUtilisateur);
    }


    public String getNomUtilisateur(Long utilisateurId) {

        Optional<Utilisateur> utilisateurOptional = utilisateurRepository.findById(utilisateurId);
        if (utilisateurOptional.isPresent()) {
            return utilisateurOptional.get().getNom();
        }
        return "Utilisateur non trouvé";
    }

    public void annulerReservation(Long reservationId, Long utilisateurId) {
        Optional<Reservation> optionalReservation = reservationRepository.findById(reservationId);

        if (optionalReservation.isPresent()) {
            Reservation reservation = optionalReservation.get();
            Long particulierId = reservation.getParticulier().getIdUtilisateur();
            Long prestataireId = reservation.getPrestataire().getIdUtilisateur();

            String particulierEmail = reservation.getParticulier().getEmail();
            String prestataireEmail = reservation.getPrestataire().getEmail();
            String serviceName = reservation.getDemande().getServicee().getNomservice();
            String dateDemande = reservation.getDemande().getDate().toString();

            String nomUtilisateur = getNomUtilisateur(utilisateurId);
            if (utilisateurId.equals(particulierId)) {
                emailService.sendHtmlEmail(prestataireEmail,
                        "Annulation de la réservation",
                        "<html><head>" +
                                "<style>" +
                                "body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }" +
                                "p { margin: 15px 0; }" +
                                "strong { color: #007BFF; }" +
                                "h1 { color: #444; }" +
                                "</style>" +
                                "</head><body>" +
                                "<h1>Annulation de la réservation</h1>" +
                                "<p>Bonjour,</p>" +
                                "<p><strong>" + nomUtilisateur + "</strong> a annulé la réservation du service : <strong>" + serviceName + "</strong>.</p>" +
                                "<p>Merci de prendre en compte cette annulation.</p>" +
                                "<p>Cordialement,</p>" +
                                "<p>Votre service de réservation</p>" +
                                "</body></html>");
            } else if (utilisateurId.equals(prestataireId)) {
                emailService.sendHtmlEmail(particulierEmail,
                        "Annulation de la réservation par le prestataire",
                        "<html><head>" +
                                "<style>" +
                                "body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }" +
                                "p { margin: 15px 0; }" +
                                "strong { color: #007BFF; }" +
                                "h1 { color: #444; }" +
                                "</style>" +
                                "</head><body>" +
                                "<h1>Annulation de la réservation</h1>" +
                                "<p>Bonjour,</p>" +
                                "<p><strong>" + nomUtilisateur + "</strong> a annulé la réservation de votre service prévu le <strong>" + dateDemande + "</strong>.</p>" +
                                "<p>Merci de prendre en compte cette annulation.</p>" +
                                "<p>Cordialement,</p>" +
                                "<p>Votre service de réservation</p>" +
                                "</body></html>");
            } else {
                throw new IllegalArgumentException("Erreur : Cet utilisateur ne peut pas annuler cette réservation.");
            }

            Demande demande = reservation.getDemande();
            if (demande != null) {
                demande.setStatusDemande(StatusDemande.EN_COURS);
                demandeRepository.save(demande);
            }


            reservationRepository.delete(reservation);

        } else {
            throw new EntityNotFoundException("Réservation introuvable.");
        }
    }
    public void terminerReservation(Long reservationId) {

        Optional<Reservation> optionalReservation = reservationRepository.findById(reservationId);

        if (optionalReservation.isPresent()) {
            Reservation reservation = optionalReservation.get();


            if (reservation.getStatusReservation() != StatusReservation.TERMINE) {

                reservation.setStatusReservation(StatusReservation.TERMINE);
                reservationRepository.save(reservation);
            }
        } else {
            throw new EntityNotFoundException("Réservation non trouvée.");
        }
    }
    public List<Reservation> getReservationsByPrestataireAndStatus(Long prestataireId) {

        return reservationRepository.findByPrestataireIdUtilisateurAndStatusReservation(prestataireId, StatusReservation.CONFORME);
    }
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }


}