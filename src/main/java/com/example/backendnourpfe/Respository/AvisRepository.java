package com.example.backendnourpfe.Respository;

import com.example.backendnourpfe.classes.Avis;
import com.example.backendnourpfe.classes.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AvisRepository extends JpaRepository<Avis,Long> {
    List<Avis> findByAvisUtilisateur(Utilisateur avisUtilisateur);
    List<Avis> findByUtilisateur(Utilisateur utilisateur);
    List<Avis> findByAvisUtilisateurIdUtilisateur(Long utilisateurId);

    @Query("SELECT a.idAvis, a.note, a.commentaire, a.dateAvis, a.utilisateur.nom " +
            "FROM Avis a WHERE a.avisUtilisateur.idUtilisateur = :idAvisUtilisateur")
    List<Object[]> findAvisByAvisUtilisateurId(Long idAvisUtilisateur);
}


