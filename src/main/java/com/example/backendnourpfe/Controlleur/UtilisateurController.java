package com.example.backendnourpfe.Controlleur;



import com.example.backendnourpfe.Respository.UtilisateurRepository;
import com.example.backendnourpfe.classes.*;

import com.example.backendnourpfe.service.UtilisateurService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.security.Principal;
import java.util.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/utilisateurss")

public class UtilisateurController {

    @Autowired
    private UtilisateurService utilisateurService;
    @Autowired
    private UtilisateurRepository utilisateurRepository;


    @PostMapping("/ajouter")
    public ResponseEntity<Utilisateur> ajouterUtilisateur(@RequestBody Utilisateur utilisateur) {

        Utilisateur savedUser = utilisateurService.ajouterUtilisateur(utilisateur);

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


    @PostMapping("/creerDemande/{idUtilisateur}/{idservice}")
    public ResponseEntity<Map<String, Object>> creerDemande(
            @PathVariable Long idUtilisateur,
            @PathVariable Long idservice,
            @RequestBody Demande demande) {

        Map<String, Object> response = utilisateurService.creerDemande(idUtilisateur, idservice, demande);
        return ResponseEntity.ok(response);
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

    /*
        @GetMapping("/activation/{email}")
        public String activateAccount(@PathVariable String email) {
            // Trouver l'utilisateur en fonction de l'email
            Optional<Utilisateur> utilisateurOpt = utilisateurRepository.findByEmail(email);

            if (utilisateurOpt.isPresent()) {
                Utilisateur utilisateur = utilisateurOpt.get();

                // Vérifier si le statut est ATTENTE avant de le mettre à jour
                if (utilisateur.getStatus() == StatusUtilisateur.ATTENTE) {
                    utilisateur.setStatus(StatusUtilisateur.ACCEPTE);  // Mettre à jour le statut à "ACCEPTE"
                    utilisateurRepository.save(utilisateur); // Sauvegarder les modifications

                    // Rediriger vers une page de succès
                    return "redirect:/activation-success";  // Rediriger vers une page de succès
                }
            }

            // Si l'email est invalide ou l'utilisateur est déjà activé
            return "redirect:/activation-failed";  // Rediriger vers une page d'échec
        }*/
    @GetMapping("/activation/{email}")
    public ResponseEntity<Void> activateAccount(@PathVariable String email) {
        // Décoder l'email (pour éviter les problèmes d'encodage dans l'URL)
        try {
            email = URLDecoder.decode(email, StandardCharsets.UTF_8);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }

        // Trouver l'utilisateur en base de données
        Optional<Utilisateur> utilisateurOpt = utilisateurRepository.findByEmail(email);

        if (utilisateurOpt.isPresent()) {
            Utilisateur utilisateur = utilisateurOpt.get();

            // Vérifier le statut avant de mettre à jour
            if (utilisateur.getStatus() == StatusUtilisateur.ATTENTE) {
                utilisateur.setStatus(StatusUtilisateur.ACCEPTE);
                utilisateurRepository.save(utilisateur);

                // 🔄 Redirection vers Angular (http://localhost:4200/login)
                return ResponseEntity.status(HttpStatus.FOUND)
                        .header(HttpHeaders.LOCATION, "http://localhost:4200/login")
                        .build();
            }
        }

        // Si l'utilisateur n'existe pas ou est déjà activé, renvoyer une erreur
        return ResponseEntity.badRequest().build();
    }

    @GetMapping("/getById/{id}")
    public ResponseEntity<Utilisateur> getUtilisateurById(@PathVariable Long id) {
        Optional<Utilisateur> utilisateur = utilisateurService.getUtilisateurById(id);
        return utilisateur.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/checkAuth")
    public ResponseEntity<String> checkAuth(Principal principal) {
        return principal != null ? ResponseEntity.ok("Utilisateur authentifié : " + principal.getName())
                : ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Non authentifié");
    }



  @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody Utilisateur utilisateurDetails) {

        return utilisateurService.updateUser(id, utilisateurDetails);
    }/*
    @PutMapping("/affecter-adresse/{utilisateurId}/{adresseId}")
    public ResponseEntity<Utilisateur> affecterAdresse(@PathVariable Long utilisateurId, @PathVariable Long adresseId) {
        Utilisateur utilisateur = utilisateurService.affecterAdresse(utilisateurId, adresseId);
        return ResponseEntity.ok(utilisateur);
    }

*/
@PutMapping("/affecter-adresse/{utilisateurId}/{adresseId}")
public ResponseEntity<Map<String, Object>> affecterAdresse(@PathVariable Long utilisateurId, @PathVariable Long adresseId) {
    Map<String, Object> response = utilisateurService.affecterAdresse(utilisateurId, adresseId);
    return ResponseEntity.ok(response);
}

}


