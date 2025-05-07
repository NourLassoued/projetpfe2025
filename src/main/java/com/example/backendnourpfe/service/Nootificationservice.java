package com.example.backendnourpfe.service;

import com.example.backendnourpfe.Respository.NotificationRepository;
import com.example.backendnourpfe.Respository.PublicationRepository;
import com.example.backendnourpfe.Respository.UtilisateurRepository;
import com.example.backendnourpfe.classes.Notification;
import com.example.backendnourpfe.classes.Publication;
import com.example.backendnourpfe.classes.UserRole;
import com.example.backendnourpfe.classes.Utilisateur;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class Nootificationservice {
  @Autowired
  private PublicationRepository publicationRepository;
  @Autowired
  private UtilisateurRepository utilisateurRepository;
    @Autowired
    private NotificationRepository notificationRepository;

    public void markPublicationAsSeen(Long userId, Long publicationId) {
        // Récupérer l'utilisateur par son ID
        Utilisateur utilisateur = utilisateurRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // Récupérer la publication par son ID
        Publication publication = publicationRepository.findById(publicationId)
                .orElseThrow(() -> new RuntimeException("Publication non trouvée"));

        // Vérifier si la notification existe déjà
        Optional<Notification> notificationOpt = notificationRepository
                .findByUser_IdUtilisateurAndPublication_Id(userId, publicationId);

        if (notificationOpt.isPresent()) {
            // Si la notification existe déjà, mettre à jour le statut "vue"
            Notification notification = notificationOpt.get();
            notification.setSeen(true);
            notificationRepository.save(notification);
        } else {
            Notification notification = new Notification();
            notification.setUser(utilisateur);
            notification.setPublication(publication);
            notification.setSeen(true);

            notificationRepository.save(notification);
        }
    }
    public List<Notification> getUnseenNotifications(Long userId) {
        return notificationRepository.findByUserIdUtilisateurAndIsSeenOrderByPublication_DatePublicationDesc(userId, false);
    }

    public List<Publication> getUnseenPublicationsByUser(Long userId) {
        Optional<Utilisateur> optionalUser = utilisateurRepository.findById(userId);

        if (optionalUser.isEmpty() || !optionalUser.get().getRole().equals(UserRole.PARTICULIER)) {
            return Collections.emptyList();
        }
        List<Publication> allPublications = publicationRepository.findAll();
        List<Notification> seenNotifications = notificationRepository.findByUserIdUtilisateur(userId);

        Set<Long> seenPublicationIds = seenNotifications.stream()
                .filter(Notification::isSeen)
                .map(n -> n.getPublication().getId())
                .collect(Collectors.toSet());

        return allPublications.stream()
                .filter(pub -> !seenPublicationIds.contains(pub.getId()))
                .collect(Collectors.toList());
    }

}
