package com.example.backendnourpfe.Respository;

import com.example.backendnourpfe.classes.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation,Long> {
    boolean existsByPrestataireAndDemande(Utilisateur prestataire, Demande demande);

    List<Reservation> findByDemandeIdDemandeAndStatusReservation(Long idDemande, StatusReservation status);

    @Query("SELECT r FROM Reservation r " +
            "WHERE r.particulier.idUtilisateur = :idParticulier " +
            "AND r.statusReservation = 'EN_ATTENTE'")
    List<Reservation> findEnAttenteByParticulier(@Param("idParticulier") Long idParticulier);
    List<Reservation> findByStatusReservationAndParticulier_IdUtilisateur(StatusReservation status, Long idUtilisateur);
    List<Reservation> findByPrestataireIdUtilisateurAndStatusReservation(Long prestataireId, StatusReservation statusReservation);


}
