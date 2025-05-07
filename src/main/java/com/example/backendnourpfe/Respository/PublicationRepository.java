package com.example.backendnourpfe.Respository;

import com.example.backendnourpfe.classes.Publication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface PublicationRepository extends JpaRepository<Publication, Long> {
    List<Publication> findByEntreprise_IdUtilisateur(Long entrepriseId);
    List<Publication> findAllByOrderByDatePublicationDesc();
}
