package service;

import com.example.backendnourpfe.service.NotificationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class NotificationServiceTest {

    private NotificationService notificationService;

    @BeforeEach
    void setUp() {
        notificationService = new NotificationService();
    }

    @Test
    void testAddNotificationAndHasPending() {
        Long prestataireId = 1L;
        String message = "Nouvelle notification";

        assertFalse(notificationService.hasPending(prestataireId));

        notificationService.addNotification(prestataireId, message);

        assertTrue(notificationService.hasPending(prestataireId));
    }

    @Test
    void testGetAndRemoveNotifications() {
        Long prestataireId = 2L;
        String message1 = "Notif 1";
        String message2 = "Notif 2";

        notificationService.addNotification(prestataireId, message1);
        notificationService.addNotification(prestataireId, message2);

        List<String> notifications = notificationService.getAndRemoveNotifications(prestataireId);

        assertNotNull(notifications);
        assertEquals(2, notifications.size());
        assertTrue(notifications.contains(message1));
        assertTrue(notifications.contains(message2));

        // Après suppression, il ne doit plus y avoir de notifications en attente
        assertFalse(notificationService.hasPending(prestataireId));

        // Si on récupère à nouveau, on doit obtenir null (car supprimé)
        assertNull(notificationService.getAndRemoveNotifications(prestataireId));
    }

    @Test
    void testGetAndRemoveNotificationsWhenNone() {
        Long prestataireId = 3L;
        assertNull(notificationService.getAndRemoveNotifications(prestataireId));
        assertFalse(notificationService.hasPending(prestataireId));
    }
}