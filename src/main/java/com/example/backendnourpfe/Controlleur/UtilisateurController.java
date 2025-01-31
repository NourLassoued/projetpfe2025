package com.example.backendnourpfe.Controlleur;


import com.example.backendnourpfe.classes.Utilisateur;
import com.example.backendnourpfe.service.UtilisateurService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

}



