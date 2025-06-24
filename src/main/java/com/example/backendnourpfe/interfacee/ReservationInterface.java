package com.example.backendnourpfe.interfacee;

import com.example.backendnourpfe.classes.Reservation;
import jakarta.mail.MessagingException;

import java.util.List;

public interface ReservationInterface {
     Reservation creerReservation(Long idParticulier, Long idPrestataire, Long idDemande, Reservation reservation) throws MessagingException;
     Reservation confirmerReservation(Long idReservation);
     void refuserReservation(Long reservationId);
     List<Reservation> getReservationsByDemandeId(Long idDemande);
     void annulerReservation(Long reservationId, Long utilisateurId);
     void terminerReservation(Long reservationId);
     List<Reservation> getReservationsTermineesByParticulier(Long idUtilisateur);
     List<Reservation> getReservationsEnAttenteParParticulier(Long idParticulier);
}
