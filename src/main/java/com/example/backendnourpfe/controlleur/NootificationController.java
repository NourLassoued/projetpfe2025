package com.example.backendnourpfe.controlleur;

import com.example.backendnourpfe.classes.Notification;
import com.example.backendnourpfe.classes.Publication;
import com.example.backendnourpfe.service.Nootificationservice;


import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/notification")
public class NootificationController {
    private final Nootificationservice nootificationservice;

    public NootificationController(Nootificationservice nootificationservice) {
        this.nootificationservice = nootificationservice;
    }

    @PutMapping("/markAsSeen/{userId}/{publicationId}")
    public void markPublicationAsSeen(@PathVariable Long userId, @PathVariable Long publicationId) {
        nootificationservice.markPublicationAsSeen(userId, publicationId);
    }


    @GetMapping("/unseen/{userId}")
    public List<Notification> getUnseenNotifications(@PathVariable Long userId) {
        return nootificationservice.getUnseenNotifications(userId);
    }
    @GetMapping("/unseenPublications/{userId}")
    public List<Publication> getUnseenPublications(@PathVariable Long userId) {
        return nootificationservice.getUnseenPublicationsByUser(userId);
    }

}
