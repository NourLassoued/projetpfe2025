package com.example.backendnourpfe.interfacee;

import com.example.backendnourpfe.classes.Reservation;
import jakarta.mail.MessagingException;

import java.util.List;

public interface ReservationInterface {
    public Reservation creerReservation(Long idParticulier, Long idPrestataire, Long idDemande, Reservation reservation) throws MessagingException;
    public Reservation confirmerReservation(Long idReservation);
    public void refuserReservation(Long reservationId);
    public List<Reservation> getReservationsByDemandeId(Long idDemande);
    public void annulerReservation(Long reservationId, Long utilisateurId);
    public void terminerReservation(Long reservationId);
    public List<Reservation> getReservationsTermineesByParticulier(Long idUtilisateur);
    public List<Reservation> getReservationsEnAttenteParParticulier(Long idParticulier);
}
