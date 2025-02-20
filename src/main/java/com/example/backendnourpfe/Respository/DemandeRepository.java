package com.example.backendnourpfe.Respository;

import com.example.backendnourpfe.classes.Demande;
import com.example.backendnourpfe.classes.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DemandeRepository  extends JpaRepository<Demande,Long> {
    List<Demande> findByUtilisateur(Utilisateur utilisateur);
}
