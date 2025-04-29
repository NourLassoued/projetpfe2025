package com.example.backendnourpfe.Respository;

import com.example.backendnourpfe.classes.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import java.util.Date;
import java.util.List;

public interface DemandeRepository  extends JpaRepository<Demande,Long> {


    List<Demande> findByUtilisateurAndStatusDemandeAndDateAfter(Utilisateur utilisateur, StatusDemande statusDemande, Date date);

@Query("SELECT d FROM Demande d JOIN d.reservations r " +
        "WHERE d.utilisateur = :utilisateur " +
        "AND d.statusDemande = :statusDemande " +
        "AND d.date > :date " +
        "AND r.statusReservation = :statutReservation")
List<Demande> findTermineesAvecReservationConforme(
        @Param("utilisateur") Utilisateur utilisateur,
        @Param("statusDemande") StatusDemande statusDemande,
        @Param("date") Date date,
        @Param("statutReservation") StatusReservation statutReservation
);


    @Query("SELECT d FROM Demande d " +
            "WHERE d.adressedemande.idAdresse = :adresseId " +
            "AND FUNCTION('DATE_FORMAT', d.date, '%W') = :jour " +
            "AND d.servicee.idservice IN :servicesOfferts " +
            "AND d.statusDemande = 'EN_COURS'")
    List<Demande> findAllByAdresseAndJourAndService(
            @Param("adresseId") Long adresseId,
            @Param("jour") String jour,
            @Param("servicesOfferts") List<Long> servicesOfferts);

}