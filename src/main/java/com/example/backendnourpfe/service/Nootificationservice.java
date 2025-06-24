package com.example.backendnourpfe.service;

import com.example.backendnourpfe.respository.NotificationRepository;
import com.example.backendnourpfe.respository.PublicationRepository;
import com.example.backendnourpfe.respository.UtilisateurRepository;
import com.example.backendnourpfe.classes.Notification;
import com.example.backendnourpfe.classes.Publication;
import com.example.backendnourpfe.classes.UserRole;
import com.example.backendnourpfe.classes.Utilisateur;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
@RequiredArgsConstructor
@Service
public class Nootificationservice {
    private final PublicationRepository publicationRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final NotificationRepository notificationRepository;


    public void markPublicationAsSeen(Long userId, Long publicationId) {
        Utilisateur utilisateur = utilisateurRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        Publication publication = publicationRepository.findById(publicationId)
                .orElseThrow(() -> new RuntimeException("Publication non trouvée"));

        Optional<Notification> notificationOpt = notificationRepository
                .findByUser_IdUtilisateurAndPublication_Id(userId, publicationId);

        if (notificationOpt.isPresent()) {
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
                .toList();
    }

}
