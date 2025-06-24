package com.example.backendnourpfe.respository;

import com.example.backendnourpfe.classes.Commentaire;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface CommentaireRepository extends JpaRepository<Commentaire, Long> {
    List<Commentaire> findByPublicationId(Long publicationId);


    List<Commentaire> findByParticulier_IdUtilisateur(Long particulierId);
}

