package com.example.backendnourpfe.service;

import com.example.backendnourpfe.Respository.CommentaireRepository;
import com.example.backendnourpfe.Respository.PublicationRepository;
import com.example.backendnourpfe.Respository.UtilisateurRepository;
import com.example.backendnourpfe.classes.Commentaire;
import com.example.backendnourpfe.classes.Publication;
import com.example.backendnourpfe.classes.Utilisateur;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.Optional;
@RequiredArgsConstructor
@Service
public class CommentaireService {

    private final CommentaireRepository commentaireRepository;
    private final PublicationRepository publicationRepository;
    private final UtilisateurRepository utilisateurRepository;



    public Commentaire ajouterCommentaire(Long publicationId, Long particulierId, Commentaire commentaire) {
        Optional<Publication> publicationOpt = publicationRepository.findById(publicationId);
        Optional<Utilisateur> particulierOpt = utilisateurRepository.findById(particulierId);

        if (publicationOpt.isPresent() && particulierOpt.isPresent()) {
            commentaire.setPublication(publicationOpt.get());
            commentaire.setParticulier(particulierOpt.get());



            return commentaireRepository.save(commentaire);
        }

        throw new RuntimeException("Publication ou Utilisateur introuvable.");
    }


    public List<Commentaire> getCommentairesParPublication(Long publicationId) {
        return commentaireRepository.findByPublicationId(publicationId);
    }



    public List<Commentaire> getCommentairesParUtilisateur(Long utilisateurId) {
        return commentaireRepository.findByParticulier_IdUtilisateur(utilisateurId);
    }
    public void supprimerCommentaire(Long id) {
        commentaireRepository.deleteById(id);
    }


}

