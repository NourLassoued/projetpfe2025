package com.example.backendnourpfe.service;

import com.example.backendnourpfe.Respository.DemandeRepository;
import com.example.backendnourpfe.Respository.PostulationRepository;
import com.example.backendnourpfe.Respository.UtilisateurRepository;
import com.example.backendnourpfe.classes.Demande;
import com.example.backendnourpfe.classes.Postulation;
import com.example.backendnourpfe.classes.UserRole;
import com.example.backendnourpfe.classes.Utilisateur;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class PostulationService {

    @Autowired
    private PostulationRepository postulationRepository;

    @Autowired
    private DemandeRepository demandeRepository;

    @Autowired
    private UtilisateurRepository utilisateurRepository;


    public Postulation postuler(Long demandeId, Long utilisateurId, Postulation postulation) {

        Optional<Demande> demandeOpt = demandeRepository.findById(demandeId);
        if (demandeOpt.isEmpty()) {
            throw new RuntimeException("Demande non trouvée.");
        }


        Optional<Utilisateur> utilisateurOpt = utilisateurRepository.findById(utilisateurId);
        if (utilisateurOpt.isEmpty()) {
            throw new RuntimeException("Utilisateur non trouvé.");
        }

        Demande demande = demandeOpt.get();
        Utilisateur utilisateur = utilisateurOpt.get();


        if (demande.getUtilisateur().getIdUtilisateur().equals(utilisateur.getIdUtilisateur())) {
            throw new RuntimeException("Vous ne pouvez pas postuler à votre propre demande.");
        }


        if (utilisateur.getRole() != UserRole.PRESTATAIRE && utilisateur.getRole() != UserRole.ENTREPRISE) {
            throw new RuntimeException("Seuls les prestataires ou les entreprises peuvent postuler.");
        }


        if (postulationRepository.existsByDemandeAndPrestataire(demande, utilisateur)) {
            throw new RuntimeException("Vous avez déjà postulé à cette demande.");
        }

        postulation.setDemande(demande);
        postulation.setPrestataire(utilisateur);


        Postulation savedPostulation = postulationRepository.save(postulation);


        demande.getPostulations().add(savedPostulation);
        demandeRepository.save(demande);


        return savedPostulation;
    }


    public List<Postulation> getPostulationsByDemande(Long demandeId) {
        Optional<Demande> demandeOpt = demandeRepository.findById(demandeId);
        if (demandeOpt.isEmpty()) {
            throw new RuntimeException("Demande non trouvée.");
        }
        return postulationRepository.findByDemande(demandeOpt.get());
    }
    public List<Postulation> getPostulationsByPrestataire(Long idPrestataire) {
        return postulationRepository.findByPrestataireIdUtilisateur(idPrestataire);
    }
    public Postulation updatePostulation(Long id, Postulation updatedPostulation) {
        Optional<Postulation> existingPostulation = postulationRepository.findById(id);
        if (existingPostulation.isPresent()) {
            Postulation p = existingPostulation.get();
            p.setCommentaire(updatedPostulation.getCommentaire());
            p.setDatePostulation(new Date());

            return postulationRepository.save(p);
        } else {
            throw new RuntimeException("Postulation non trouvée avec l'id: " + id);
        }
    }
    /*
    public void deletePostulation(Long id) {
        Optional<Postulation> postulation = postulationRepository.findById(id);
        if (postulation.isPresent()) {
            postulationRepository.delete(postulation.get());
        } else {
            throw new RuntimeException("Postulation non trouvée avec l'id: " + id);
        }
    }*/
    public void deletePostulation(Long id) {
        Optional<Postulation> postulationOpt = postulationRepository.findById(id);
        if (postulationOpt.isPresent()) {
            Postulation postulation = postulationOpt.get();
            Utilisateur prestataire = postulation.getPrestataire();


            if (!prestataire.getDemandesDejaPostulees().contains(postulation.getDemande().getIdDemande())) {
                prestataire.getDemandesDejaPostulees().add(postulation.getDemande().getIdDemande());
                utilisateurRepository.save(prestataire);
            }

            postulationRepository.delete(postulation);
        } else {
            throw new RuntimeException("Postulation non trouvée avec l'id: " + id);
        }
    }

}
