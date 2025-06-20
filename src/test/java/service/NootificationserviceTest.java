package service;

import com.example.backendnourpfe.Respository.NotificationRepository;
import com.example.backendnourpfe.Respository.PublicationRepository;
import com.example.backendnourpfe.Respository.UtilisateurRepository;
import com.example.backendnourpfe.classes.Notification;
import com.example.backendnourpfe.classes.Publication;
import com.example.backendnourpfe.classes.UserRole;
import com.example.backendnourpfe.classes.Utilisateur;

import com.example.backendnourpfe.service.Nootificationservice;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class NootificationserviceTest {

    @Mock
    private PublicationRepository publicationRepository;

    @Mock
    private UtilisateurRepository utilisateurRepository;

    @Mock
    private NotificationRepository notificationRepository;

    @InjectMocks
    private Nootificationservice notificationService;

    private Utilisateur user;
    private Publication publication;

    @BeforeEach
    void setup() {
        user = new Utilisateur();
        user.setIdUtilisateur(1L);
        user.setRole(UserRole.PARTICULIER);

        publication = new Publication();
        publication.setId(10L);
    }

    @Test
    void testMarkPublicationAsSeen_NewNotification() {
        when(utilisateurRepository.findById(1L)).thenReturn(Optional.of(user));
        when(publicationRepository.findById(10L)).thenReturn(Optional.of(publication));
        when(notificationRepository.findByUser_IdUtilisateurAndPublication_Id(1L, 10L)).thenReturn(Optional.empty());

        notificationService.markPublicationAsSeen(1L, 10L);

        verify(notificationRepository, times(1)).save(any(Notification.class));
    }

    @Test
    void testMarkPublicationAsSeen_ExistingNotification() {
        Notification notif = new Notification();
        notif.setUser(user);
        notif.setPublication(publication);
        notif.setSeen(false);

        when(utilisateurRepository.findById(1L)).thenReturn(Optional.of(user));
        when(publicationRepository.findById(10L)).thenReturn(Optional.of(publication));
        when(notificationRepository.findByUser_IdUtilisateurAndPublication_Id(1L, 10L)).thenReturn(Optional.of(notif));

        notificationService.markPublicationAsSeen(1L, 10L);

        assertTrue(notif.isSeen());
        verify(notificationRepository, times(1)).save(notif);
    }

    @Test
    void testMarkPublicationAsSeen_UserNotFound() {
        when(utilisateurRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () -> {
            notificationService.markPublicationAsSeen(1L, 10L);
        });

        assertEquals("Utilisateur non trouvé", ex.getMessage());
    }

    @Test
    void testMarkPublicationAsSeen_PublicationNotFound() {
        when(utilisateurRepository.findById(1L)).thenReturn(Optional.of(user));
        when(publicationRepository.findById(10L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () -> {
            notificationService.markPublicationAsSeen(1L, 10L);
        });

        assertEquals("Publication non trouvée", ex.getMessage());
    }

    @Test
    void testGetUnseenNotifications() {
        Notification notif1 = new Notification();
        Notification notif2 = new Notification();

        when(notificationRepository.findByUserIdUtilisateurAndIsSeenOrderByPublication_DatePublicationDesc(1L, false))
                .thenReturn(Arrays.asList(notif1, notif2));

        List<Notification> result = notificationService.getUnseenNotifications(1L);

        assertEquals(2, result.size());
        verify(notificationRepository, times(1))
                .findByUserIdUtilisateurAndIsSeenOrderByPublication_DatePublicationDesc(1L, false);
    }

    @Test
    void testGetUnseenPublicationsByUser_UserNotFound() {
        when(utilisateurRepository.findById(1L)).thenReturn(Optional.empty());

        List<Publication> result = notificationService.getUnseenPublicationsByUser(1L);

        assertTrue(result.isEmpty());
    }

    @Test
    void testGetUnseenPublicationsByUser_UserNotParticulier() {
        user.setRole(UserRole.ENTREPRISE);
        when(utilisateurRepository.findById(1L)).thenReturn(Optional.of(user));

        List<Publication> result = notificationService.getUnseenPublicationsByUser(1L);

        assertTrue(result.isEmpty());
    }

    @Test
    void testGetUnseenPublicationsByUser_WithSeenNotifications() {
        when(utilisateurRepository.findById(1L)).thenReturn(Optional.of(user));

        Publication pub1 = new Publication();
        pub1.setId(1L);
        Publication pub2 = new Publication();
        pub2.setId(2L);
        Publication pub3 = new Publication();
        pub3.setId(3L);

        when(publicationRepository.findAll()).thenReturn(Arrays.asList(pub1, pub2, pub3));

        Notification notif = new Notification();
        notif.setSeen(true);
        notif.setPublication(pub2);

        when(notificationRepository.findByUserIdUtilisateur(1L)).thenReturn(Collections.singletonList(notif));

        List<Publication> result = notificationService.getUnseenPublicationsByUser(1L);

        // Pub2 est vue, donc on attend que pub1 et pub3 restent non vues
        assertEquals(2, result.size());
        assertTrue(result.contains(pub1));
        assertTrue(result.contains(pub3));
        assertFalse(result.contains(pub2));
    }
}
