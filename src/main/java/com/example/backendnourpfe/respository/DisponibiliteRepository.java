package com.example.backendnourpfe.respository;

import com.example.backendnourpfe.classes.Disponibilite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DisponibiliteRepository extends JpaRepository<Disponibilite, Long> {


    List<Disponibilite> findByPrestataire_IdUtilisateur(Long prestataireId);
}
