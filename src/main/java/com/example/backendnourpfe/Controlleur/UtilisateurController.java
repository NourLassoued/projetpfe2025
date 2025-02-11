package com.example.backendnourpfe.Controlleur;


import com.example.backendnourpfe.Respository.UtilisateurRepository;
import com.example.backendnourpfe.classes.*;
import com.example.backendnourpfe.service.UtilisateurService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/utilisateurss")
public class UtilisateurController {

    @Autowired
    private UtilisateurService utilisateurService;
    @Autowired
    private  UtilisateurRepository utilisateurRepository;


    @PostMapping("/ajouter")
    public ResponseEntity<Utilisateur> ajouterUtilisateur(@RequestBody Utilisateur utilisateur) {

        Utilisateur savedUser = utilisateurService.ajouterUtilisateur(utilisateur);
        System.out.println("Requête reçue : " + utilisateur);
        System.out.println("Utilisateur enregistré : " + savedUser);
        return ResponseEntity.ok(savedUser);
    }
    @DeleteMapping("/deleteUser/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        try {
            utilisateurService.deleteUser(id);
            return ResponseEntity.ok().build(); // Retourne 200 OK si la suppression réussit
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            // Retourne une réponse 500 en cas d'erreur interne
        }
    }

    @PostMapping("/{utilisateurId}/creerDemande/{serviceId}")
    public ResponseEntity<Demande> creerDemande(@PathVariable Long utilisateurId, @PathVariable Long serviceId,@RequestBody Demande demande) {
        try {
            Demande nouvelleDemande = utilisateurService.creerDemande(utilisateurId, serviceId, demande);
            return new ResponseEntity<>(nouvelleDemande, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);  // 400 Bad Request en cas d'erreur
        }
    }
    @PostMapping("/{idUtilisateur}/avis/{idAvisUtilisateur}")
    public ResponseEntity<Avis> donnerAvis(
            @PathVariable Long idUtilisateur,
            @PathVariable Long idAvisUtilisateur,
            @RequestBody Avis avis) {

        try {

            Avis nouvelAvis = utilisateurService.donnerAvis(idUtilisateur, idAvisUtilisateur, avis);


            return new ResponseEntity<>(nouvelAvis, HttpStatus.CREATED);
        } catch (RuntimeException e) {

            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }
    @GetMapping("/utilisateur/{idAvisUtilisateur}")
    public List<Object> getAvisByAvisUtilisateur(@PathVariable Long idAvisUtilisateur) {
        return utilisateurService.getAvisByAvisUtilisateur(idAvisUtilisateur);
    }
    @PostMapping("/creerReservation/{idParticulier}/{idPrestataire}")
    public Reservation creerReservation(
            @PathVariable Long idParticulier,
            @PathVariable Long idPrestataire,
            @RequestBody Reservation reservation) {
        return utilisateurService.creerReservation(idParticulier, idPrestataire, reservation);
    }
    @GetMapping("/activation/{email}")
    public String activateAccount(@PathVariable String email) {
        // Trouver l'utilisateur en fonction de l'email
        Optional<Utilisateur> utilisateurOpt = utilisateurRepository.findByEmail(email);

        if (utilisateurOpt.isPresent()) {
            Utilisateur utilisateur = utilisateurOpt.get();

            // Vérifier si le statut est ATTENTE avant de le mettre à jour
            if (utilisateur.getStatus() == StatusPrestataire.ATTENTE) {
                utilisateur.setStatus(StatusPrestataire.ACCEPTE);  // Mettre à jour le statut à "ACCEPTE"
                utilisateurRepository.save(utilisateur); // Sauvegarder les modifications

                // Rediriger vers une page de succès
                return "redirect:/activation-success";  // Rediriger vers une page de succès
            }
        }

        // Si l'email est invalide ou l'utilisateur est déjà activé
        return "redirect:/activation-failed";  // Rediriger vers une page d'échec
    }

}





