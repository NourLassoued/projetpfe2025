package com.example.backendnourpfe.Controlleur;



import com.example.backendnourpfe.Config.JwtService;
import com.example.backendnourpfe.Respository.AdresseRepository;
import com.example.backendnourpfe.Respository.ServiceRepository;
import com.example.backendnourpfe.Respository.UtilisateurRepository;
import com.example.backendnourpfe.classes.*;

import com.example.backendnourpfe.service.PostulationService;
import com.example.backendnourpfe.service.UtilisateurService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


import java.io.IOException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.security.Principal;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/utilisateurss")

public class UtilisateurController {

    @Autowired
    private UtilisateurService utilisateurService;
    @Autowired
    private UtilisateurRepository utilisateurRepository;
    @Autowired
    private PostulationService postulationService;



    @PostMapping("/ajouter")
    public ResponseEntity<Utilisateur> ajouterUtilisateur(@RequestBody Utilisateur utilisateur) {

        Utilisateur savedUser = utilisateurService.ajouterUtilisateur(utilisateur);

        return ResponseEntity.ok(savedUser);
    }

    @DeleteMapping("/deleteUser/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        try {
            utilisateurService.deleteUser(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();

        }
    }

    @PostMapping(value = "/creerDemande/{emailUtilisateur}/{idService}/{idAdresse}", consumes = "application/json", produces = "application/json")
public ResponseEntity<Map<String, Object>> creerDemande(
        @PathVariable String emailUtilisateur,
        @PathVariable Long idService,
        @PathVariable Long idAdresse,
        @RequestBody Demande demande) {

    Map<String, Object> response = utilisateurService.creerDemande(emailUtilisateur, idService, idAdresse, demande);
    return ResponseEntity.ok(response);
}
/*

    @PutMapping( "/updateDemande/{id}")
    public Demande updateDemande(@PathVariable Long id, @RequestBody Demande demandeDetails) {
        return utilisateurService.updateDemande(id, demandeDetails);
    }*/


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




    @GetMapping("/{email}")
    public ResponseEntity<Void> activateAccount(@PathVariable String email, HttpServletResponse response) {

        try {
            email = URLDecoder.decode(email, StandardCharsets.UTF_8);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }

        Optional<Utilisateur> utilisateurOpt = utilisateurRepository.findByEmail(email);

        if (utilisateurOpt.isPresent()) {
            Utilisateur utilisateur = utilisateurOpt.get();

            if (utilisateur.getStatus() == StatusUtilisateur.ATTENTE) {
                utilisateur.setStatus(StatusUtilisateur.ACCEPTE);
                utilisateurRepository.save(utilisateur);
                try {


                    response.sendRedirect("http://localhost:4200/login");
                } catch (IOException e) {
                    e.printStackTrace();
                }

                return ResponseEntity.status(HttpStatus.FOUND).build();
            }
        }

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

    @GetMapping("/entreprises")
    public List<Utilisateur> getAllEntreprises() {
        return utilisateurService.getAllEntreprises();
    }

  @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody Utilisateur utilisateurDetails) {

        return utilisateurService.updateUser(id, utilisateurDetails);
    }
@PutMapping("/affecter-adresse/{utilisateurId}/{adresseId}")
public ResponseEntity<Map<String, Object>> affecterAdresse(@PathVariable Long utilisateurId, @PathVariable Long adresseId) {
    Map<String, Object> response = utilisateurService.affecterAdresse(utilisateurId, adresseId);
    return ResponseEntity.ok(response);
}
    @GetMapping("/email-exists/{email}")
    public ResponseEntity<Boolean> checkEmailExists(@PathVariable String email) {
        boolean exists = utilisateurService.checkEmailExists(email);
        return ResponseEntity.ok(exists);  // Retourne "true" si l'email existe, "false" sinon
    }
    @GetMapping("/users")
    public ResponseEntity<List<Utilisateur>> getAllUsers() {
        List<Utilisateur> users = utilisateurService.getAllUsers();
        return ResponseEntity.ok(users);
    }
    @GetMapping("/prestataires")
    public ResponseEntity<List<Utilisateur>> getPrestataires() {
        List<Utilisateur> prestataires = utilisateurService.getAllPrestataires();
        return ResponseEntity.ok(prestataires);
    }
    @GetMapping("/particuliers")
    public ResponseEntity<List<Utilisateur>> getUtilisateursParticuliers() {
        List<Utilisateur> particuliers = utilisateurService.getAllParticuliers();
        return ResponseEntity.ok(particuliers);
    }
    @PostMapping("/postuler/{demandeId}/{utilisateurId}")
    public ResponseEntity<Postulation> postuler(
            @PathVariable Long demandeId,
            @PathVariable Long utilisateurId,
            @RequestBody Postulation postulation) {

        // Appeler la méthode du service pour effectuer la postulation
        Postulation savedPostulation = postulationService.postuler(demandeId, utilisateurId, postulation);

        // Retourner une réponse avec l'objet postulation sauvegardé
        return ResponseEntity.ok(savedPostulation);
    }

}




