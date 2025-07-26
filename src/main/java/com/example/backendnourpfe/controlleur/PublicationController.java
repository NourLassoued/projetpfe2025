package com.example.backendnourpfe.controlleur;


import com.example.backendnourpfe.respository.PublicationRepository;
import com.example.backendnourpfe.respository.UtilisateurRepository;
import com.example.backendnourpfe.classes.Publication;
import com.example.backendnourpfe.classes.UserRole;
import com.example.backendnourpfe.classes.Utilisateur;
import com.example.backendnourpfe.service.PublicationService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/publications")
@CrossOrigin(origins = "*")
public class PublicationController {
    private final UtilisateurRepository utilisateurRepository;
    private final PublicationService publicationService;
    private final PublicationRepository publicationRepository;

    public PublicationController(UtilisateurRepository utilisateurRepository,
                                 PublicationService publicationService,
                                 PublicationRepository publicationRepository) {
        this.utilisateurRepository = utilisateurRepository;
        this.publicationService = publicationService;
        this.publicationRepository = publicationRepository;
    }

    @PostMapping("/entreprise/{entrepriseId}")
    public ResponseEntity<Publication> ajouterPublication(
            @RequestBody Publication publication,
            @PathVariable Long entrepriseId) {
        Publication saved = publicationService.ajouterPublication(publication, entrepriseId);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/getAllPublications")
    public ResponseEntity<List<Publication>> getAllPublications() {
        List<Publication> publications = publicationService.getAllPublications();
        return ResponseEntity.ok(publications);
    }


    @GetMapping("/entreprise/{entrepriseId}")
    public ResponseEntity<List<Publication>> getPublicationsParEntreprise(@PathVariable Long entrepriseId) {
        List<Publication> publications = publicationService.getPublicationsParEntreprise(entrepriseId);
        return ResponseEntity.ok(publications);
    }
    @PutMapping("/{publicationId}/like/{particulierId}")
    public ResponseEntity<Void> toggleLike(@PathVariable Long publicationId, @PathVariable Long particulierId) {
        publicationService.toggleLike(publicationId, particulierId);
        return ResponseEntity.ok().build();
    }
    @GetMapping("/{publicationId}/likes")
    public ResponseEntity<Long> getNombreDeLikes(@PathVariable Long publicationId) {
        long nombreDeLikes = publicationService.getNombreDeLikes(publicationId);
        return ResponseEntity.ok(nombreDeLikes);
    }
    @GetMapping("/{publicationId}/like/{utilisateurId}")
    public ResponseEntity<Boolean> utilisateurADejaLike(@PathVariable Long publicationId,
                                                        @PathVariable Long utilisateurId) {
        boolean aLike = publicationService.utilisateurADejaLike(publicationId, utilisateurId);
        return ResponseEntity.ok(aLike);
    }


    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> supprimerPublication(@PathVariable Long id) {
        publicationService.supprimerPublication(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/notifications/{userId}")
    public List<Map<String, Object>> getNotifications(@PathVariable Long userId) {
        Utilisateur user = utilisateurRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        if (user.getRole() != UserRole.PARTICULIER) {
            return Collections.emptyList();
        }

        List<Publication> publications = publicationRepository.findAllByOrderByDatePublicationDesc();

        return publications.stream()
                .map(pub -> {
                    Map<String, Object> notif = new HashMap<>();
                    notif.put("id", pub.getId());
                    notif.put("message", "Nouvelle annonce de " + pub.getEntreprise().getNomEntreprise() +
                            " : " + pub.getTitre() + " (" + pub.getDatePublication() + ")");
                    return notif;
                })
                .limit(10)
                .toList();
    }

}
