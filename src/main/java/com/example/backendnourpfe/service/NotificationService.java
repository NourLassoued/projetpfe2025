package com.example.backendnourpfe.service;

import com.example.backendnourpfe.classes.Notification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class NotificationService {

    private  final Map<Long, List<String>> pendingNotifications = new ConcurrentHashMap<>();

    public void addNotification(Long prestataireId, String message) {
        pendingNotifications
                .computeIfAbsent(prestataireId, k -> new ArrayList<>())
                .add(message);
    }

    public List<String> getAndRemoveNotifications(Long prestataireId) {
        return pendingNotifications.remove(prestataireId);
    }

    public boolean hasPending(Long prestataireId) {
        return pendingNotifications.containsKey(prestataireId);
    }
}
