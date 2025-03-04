package com.example.backendnourpfe.interfacee;


import com.example.backendnourpfe.classes.*;
import org.springframework.http.ResponseEntity;

import javax.management.ServiceNotFoundException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface UtlisateurInterface {
    public Utilisateur ajouterUtilisateur(Utilisateur utilisateur);
    void deleteUser(Long id);
    public Optional<Utilisateur> getUtilisateurById(Long id);
    ResponseEntity<?> updateUser(Long id, Utilisateur utilisateurDetails);
    public Avis donnerAvis(Long idUtilisateur, Long idAvisUtilisateur, Avis avis);
    public List<Object> getAvisByAvisUtilisateur(Long idAvisUtilisateur);
    public Reservation creerReservation(Long idParticulier, Long idPrestataire, Reservation reservation);

    public Map<String, Object> creerDemande(Long idUtilisateur, Long idservice, Demande demande);
}
