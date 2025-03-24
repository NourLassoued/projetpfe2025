package com.example.backendnourpfe.interfacee;


import com.example.backendnourpfe.classes.*;
import org.springframework.http.ResponseEntity;

import javax.management.ServiceNotFoundException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface UtlisateurInterface {
   // public Utilisateur affecterAdresse(Long utilisateurId, Long adresseId);
   public Map<String, Object> affecterAdresse(Long utilisateurId, Long adresseId);
    public Utilisateur ajouterUtilisateur(Utilisateur utilisateur);
    public boolean checkEmailExists(String email);
    void deleteUser(Long id);
    public Optional<Utilisateur> getUtilisateurById(Long id);
    ResponseEntity<?> updateUser(Long id, Utilisateur utilisateurDetails);
    public Avis donnerAvis(Long idUtilisateur, Long idAvisUtilisateur, Avis avis);
    public List<Object> getAvisByAvisUtilisateur(Long idAvisUtilisateur);
    public Reservation creerReservation(Long idParticulier, Long idPrestataire, Reservation reservation);
 public List<Utilisateur> getAllPrestataires();
    public List<Utilisateur> getAllParticuliers();
    public List<Utilisateur> getAllEntreprises();
    public Map<String, Object> creerDemande(String emailUtilisateur, Long idService, Long idAdresse, Demande demande) ;

 public List<Utilisateur> getAllUsers();
}
