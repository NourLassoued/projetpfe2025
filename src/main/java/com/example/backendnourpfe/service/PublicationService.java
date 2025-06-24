package com.example.backendnourpfe.service;

import com.example.backendnourpfe.respository.PublicationRepository;
import com.example.backendnourpfe.respository.UtilisateurRepository;
import com.example.backendnourpfe.classes.Publication;
import com.example.backendnourpfe.classes.UserRole;
import com.example.backendnourpfe.classes.Utilisateur;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class PublicationService {

    @Autowired
    public PublicationRepository publicationRepository;

    @Autowired
    public UtilisateurRepository utilisateurRepository;
    @Autowired
    public EmailService emailService;


    public Publication ajouterPublication(Publication publication, Long entrepriseId) {
        Utilisateur entreprise = utilisateurRepository.findById(entrepriseId)
                .orElseThrow(() -> new RuntimeException("Entreprise non trouvée"));

        if (entreprise.getRole() != UserRole.ENTREPRISE) {
            throw new RuntimeException("L'utilisateur n'est pas une entreprise");
        }

        publication.setEntreprise(entreprise);
        publication.setDatePublication(LocalDate.now());
        Publication savedPublication = publicationRepository.save(publication);

        List<Utilisateur> particuliers = utilisateurRepository.findByRole(UserRole.PARTICULIER);


        for (Utilisateur particulier : particuliers) {
            String sujet = "Nouvelle publication d'une entreprise sur notre plateforme !";
            String contenu = "<html><body style='font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 30px;'>" +
                    "<div style='max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);'>" +
                    "<h2 style='color: #2c3e50; border-bottom: 1px solid #e0e0e0; padding-bottom: 10px;'>📣 Nouvelle publication</h2>" +
                    "<p style='font-size: 16px; color: #333;'>Bonjour <strong style='color: #2c3e50;'>" + particulier.getNom() + "</strong>,</p>" +
                    "<p style='font-size: 16px; color: #333;'>L'entreprise <strong style='color: #2c3e50;'>" + entreprise.getNomEntreprise() + "</strong> vient de publier une nouvelle annonce :</p>" +
                    "<div style='background-color: #f9fafb; padding: 15px 20px; border-left: 4px solid #3498db; margin: 20px 0; border-radius: 5px;'>" +
                    "<p style='margin: 5px 0;'><strong>Titre :</strong> " + savedPublication.getTitre() + "</p>" +
                    "<p style='margin: 5px 0;'><strong>Description :</strong> " + savedPublication.getDescription() + "</p>" +
                    "</div>" +
                    "<p style='font-size: 15px; color: #555;'>Connectez-vous dès maintenant pour découvrir plus de détails !</p>" +
                    "<a  href='http://localhost:4200/Front' style='display: inline-block; padding: 10px 20px; margin-top: 10px; background-color: #3498db; color: #ffffff; text-decoration: none; border-radius: 5px;'>Voir la publication</a>" +
                    "<p style='font-size: 13px; color: #999; margin-top: 30px;'>Merci,<br><em>Votre équipe</em></p>" +
                    "</div></body></html>";



            try {
                emailService.envoyerEmailConfirmation(particulier.getEmail(), sujet, contenu);
            } catch (MessagingException e) {

                System.err.println("Erreur lors de l'envoi de l'email à " + particulier.getEmail() + " : " + e.getMessage());
            }
        }

        return savedPublication;
    }
    public List<Publication> getAllPublications() {
        return publicationRepository.findAll();
    }


    public List<Publication> getPublicationsParEntreprise(Long entrepriseId) {
        return publicationRepository.findByEntreprise_IdUtilisateur(entrepriseId);
    }

    public void supprimerPublication(Long id) {

        publicationRepository.deleteById(id);
    }
    public void toggleLike(Long publicationId, Long particulierId) {
        Publication publication = publicationRepository.findById(publicationId)
                .orElseThrow(() -> new RuntimeException("Publication non trouvée"));

        Utilisateur particulier = utilisateurRepository.findById(particulierId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // Vérification du rôle de l'utilisateur
        if (particulier.getRole() != UserRole.PARTICULIER) {
            throw new RuntimeException("Seuls les utilisateurs de type 'Particulier' peuvent aimer ou ne pas aimer les publications.");
        }

        // Vérifier si l'utilisateur a déjà aimé cette publication
        if (publication.getLikedByUsers().contains(particulier)) {
            // Si oui, retirer le like
            publication.getLikedByUsers().remove(particulier);
        } else {
            // Sinon, ajouter le like
            publication.getLikedByUsers().add(particulier);
        }

        publicationRepository.save(publication);
    }


    public long getNombreDeLikes(Long publicationId) {
        Publication publication = publicationRepository.findById(publicationId)
                .orElseThrow(() -> new RuntimeException("Publication non trouvée"));
        // Retourner le nombre de likes
        return publication.getLikedByUsers().size();
    }
    public boolean utilisateurADejaLike(Long publicationId, Long utilisateurId) {
        return publicationRepository.utilisateurADejaLike(publicationId, utilisateurId);
    }
}
