package com.example.backendnourpfe.interfacee;


import com.example.backendnourpfe.classes.*;
import org.springframework.http.ResponseEntity;


import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface UtlisateurInterface {

    Map<String, Object> affecterAdresse(Long utilisateurId, Long adresseId);
     Utilisateur ajouterUtilisateur(Utilisateur utilisateur);
     boolean checkEmailExists(String email);
    void deleteUser(Long id);
     Optional<Utilisateur> getUtilisateurById(Long id);
    ResponseEntity<?> updateUser(Long id, Utilisateur utilisateurDetails);
     Avis donnerAvis(Long idUtilisateur, Long idAvisUtilisateur, Avis avis);
     List<Object> getAvisByAvisUtilisateur(Long idAvisUtilisateur);

  List<Utilisateur> getAllPrestataires();
     List<Utilisateur> getAllParticuliers();
     List<Utilisateur> getAllEntreprises();
     Map<String, Object> creerDemande(String emailUtilisateur, Long idService, Long idAdresse, Demande demande) ;

     List<Utilisateur> getAllUsers();

}
