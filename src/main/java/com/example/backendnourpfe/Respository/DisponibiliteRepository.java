package com.example.backendnourpfe.Respository;

import com.example.backendnourpfe.classes.Disponibilite;
import com.example.backendnourpfe.classes.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DisponibiliteRepository extends JpaRepository<Disponibilite, Long> {


    List<Disponibilite> findByPrestataire_IdUtilisateur(Long prestataireId);
}
