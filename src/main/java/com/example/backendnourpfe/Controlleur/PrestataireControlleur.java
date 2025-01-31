package com.example.backendnourpfe.Controlleur;



import com.example.backendnourpfe.classes.Prestataire;
import com.example.backendnourpfe.service.PrestataireService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/prestataires")
public class PrestataireControlleur {
    @Autowired
    private PrestataireService prestataireService;

    @PostMapping("/ajouter")
    public ResponseEntity<Prestataire> ajouterPrestataire(@RequestBody Prestataire prestataire) {
        Prestataire savedPrestataire = prestataireService.ajouterPrestataire(prestataire);
        return ResponseEntity.ok(savedPrestataire);
    }
}

