package com.example.backendnourpfe.Controlleur;


import com.example.backendnourpfe.classes.Entreprise;
import com.example.backendnourpfe.service.EntrepriseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/entreprises")
public class EntrepriseController {

    @Autowired
    private EntrepriseService entrepriseService;


    @PostMapping("/ajouterEntreprise")
    public ResponseEntity<Entreprise> ajouterEntreprise(@RequestBody Entreprise entreprise) {
        Entreprise savedEntreprise = entrepriseService.ajouterEntreprise(entreprise);
        return ResponseEntity.ok(savedEntreprise);
    }
}