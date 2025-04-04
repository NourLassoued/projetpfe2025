package com.example.backendnourpfe.Respository;

import com.example.backendnourpfe.classes.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalTime;
import java.util.Date;
import java.util.List;

public interface DemandeRepository  extends JpaRepository<Demande,Long> {
    List<Demande> findByUtilisateur(Utilisateur utilisateur);

    List<Demande> findByUtilisateurAndStatusDemandeAndDateAfter(Utilisateur utilisateur, StatusDemande statusDemande, Date date);
    public List<Demande> findByUtilisateurAndStatusDemande(Utilisateur utilisateur, StatusDemande statusDemande);

    public List<Demande> findByUtilisateurAndStatusDemandeInAndDateBefore(
            Utilisateur utilisateur,
            List<StatusDemande> statusDemande,
            Date date);

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