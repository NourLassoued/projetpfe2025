package com.example.backendnourpfe.Controlleur;

import com.example.backendnourpfe.service.NotificationService;
import lombok.RequiredArgsConstructor;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;


import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/notifications")

@RequiredArgsConstructor
public class NotificationController {

    private final SimpMessagingTemplate messagingTemplate;
    private final NotificationService notificationStorage;


    @MessageMapping("/send-notification")
    public void sendNotificationToPrestataire(Long prestataireId, String message) {

        messagingTemplate.convertAndSend("/topic/notifications/" +prestataireId, message);
        notificationStorage.addNotification(prestataireId, message);
    }

@GetMapping("/{prestataireId}")
public List<String> getPendingNotifications(@PathVariable Long prestataireId) {
    return notificationStorage.getAndRemoveNotifications(prestataireId);
}


    @MessageMapping("/send")
    @SendTo("/topic/notification")
    public void handleMessage(@Payload String message) {
        System.out.println("Message reçu : " + message);
    }

    }



