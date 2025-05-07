package com.example.backendnourpfe.Controlleur;

import com.example.backendnourpfe.Respository.PostulationRepository;
import com.example.backendnourpfe.Respository.PublicationRepository;
import com.example.backendnourpfe.Respository.UtilisateurRepository;
import com.example.backendnourpfe.classes.Publication;
import com.example.backendnourpfe.classes.UserRole;
import com.example.backendnourpfe.classes.Utilisateur;
import com.example.backendnourpfe.service.PublicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/publications")
@CrossOrigin(origins = "*")
public class PublicationController {
    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private PublicationService publicationService;
    @Autowired
    private PublicationRepository publicationRepository;


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
                .collect(Collectors.toList());
    }

}
