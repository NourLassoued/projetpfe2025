package com.example.backendnourpfe.Controlleur;


import com.example.backendnourpfe.classes.Avis;
import com.example.backendnourpfe.classes.Demande;
import com.example.backendnourpfe.classes.Reservation;
import com.example.backendnourpfe.classes.Utilisateur;
import com.example.backendnourpfe.service.UtilisateurService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/utilisateurss")
public class UtilisateurController {

    @Autowired
    private UtilisateurService utilisateurService;


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
}





