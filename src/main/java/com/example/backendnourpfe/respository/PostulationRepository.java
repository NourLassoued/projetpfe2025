package com.example.backendnourpfe.respository;

import com.example.backendnourpfe.classes.Demande;
import com.example.backendnourpfe.classes.Postulation;
import com.example.backendnourpfe.classes.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostulationRepository extends JpaRepository<Postulation, Long> {

    List<Postulation> findByDemande_IdDemande(Long idDemande);

    List<Postulation> findByDemande(Demande demande);
    List<Postulation> findByPrestataireIdUtilisateur(Long idPrestataire);

    boolean existsByDemandeAndPrestataire(Demande demande, Utilisateur prestataire);
}
