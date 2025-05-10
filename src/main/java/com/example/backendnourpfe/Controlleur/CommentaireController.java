package com.example.backendnourpfe.Controlleur;

import com.example.backendnourpfe.classes.Commentaire;
import com.example.backendnourpfe.service.CommentaireService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/commentaires")
@CrossOrigin(origins = "*")
public class CommentaireController {

    @Autowired
    private CommentaireService commentaireService;


    @PostMapping("/ajouter/{publicationId}/{utilisateurId}")
    public ResponseEntity<Commentaire> ajouterCommentaire(
            @PathVariable Long publicationId,
            @PathVariable Long utilisateurId,
            @RequestBody Commentaire commentaire) {
        Commentaire saved = commentaireService.ajouterCommentaire(publicationId, utilisateurId, commentaire);
        return ResponseEntity.ok(saved);
    }


    @GetMapping("/publication/{publicationId}")
    public ResponseEntity<List<Commentaire>> getCommentairesParPublication(@PathVariable Long publicationId) {
        List<Commentaire> commentaires = commentaireService.getCommentairesParPublication(publicationId);
        return ResponseEntity.ok(commentaires);
    }


    @GetMapping("/utilisateur/{utilisateurId}")
    public ResponseEntity<List<Commentaire>> getCommentairesParUtilisateur(@PathVariable Long utilisateurId) {
        List<Commentaire> commentaires = commentaireService.getCommentairesParUtilisateur(utilisateurId);
        return ResponseEntity.ok(commentaires);
    }
    @DeleteMapping("/deletecommaintre/{id}")
    public ResponseEntity<Void> supprimerCommentaire(@PathVariable Long id) {
        commentaireService.supprimerCommentaire(id);
        return ResponseEntity.noContent().build();
    }


}