package com.example.backendnourpfe.service;

import com.example.backendnourpfe.respository.MessageRepository;

import com.example.backendnourpfe.respository.UtilisateurRepository;
import com.example.backendnourpfe.classes.Message;

import com.example.backendnourpfe.classes.Utilisateur;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
@RequiredArgsConstructor
@Service
public class MessageService {
    private final MessageRepository messageRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final SimpMessagingTemplate messagingTemplate;


    public List<Message> getUndeliveredMessages(Long receiverId) {
        List<Message> messages = messageRepository.findByReceiverIdUtilisateurAndDeliveredFalse(receiverId);

        for (Message message : messages) {
            if (message.getReadTimestamp() != null) {
                message.setDelivered(true);
                messageRepository.save(message);

            }

        }

        return messages;
    }
public void sendMessage(Message chatMessage) {

    if (chatMessage.getSender() == null || chatMessage.getReceiver() == null) {
        throw new IllegalArgumentException("Sender and receiver must not be null");
    }

    if (chatMessage.getContent() == null || chatMessage.getContent().isEmpty()) {
        throw new IllegalArgumentException("Message content must not be null or empty");
    }

    // Charger les utilisateurs existants de la base
    Utilisateur sender = utilisateurRepository.findById(chatMessage.getSender().getIdUtilisateur())
            .orElseThrow(() -> new IllegalArgumentException("Sender not found in the database"));

    Utilisateur receiver = utilisateurRepository.findById(chatMessage.getReceiver().getIdUtilisateur())
            .orElseThrow(() -> new IllegalArgumentException("Receiver not found in the database"));

    // Vérifier les rôles
    if (sender.getRole() == null) {
        throw new IllegalArgumentException("Sender's role must not be null");
    }

    if (receiver.getRole() == null) {
        throw new IllegalArgumentException("Receiver's role must not be null");
    }

    // Mise à jour du message
    chatMessage.setSender(sender);
    chatMessage.setReceiver(receiver);
    chatMessage.setTimestamp(LocalDateTime.now());
    chatMessage.setDelivered(false);

    // Sauvegarde en base
    messageRepository.save(chatMessage);

    // Envoi WebSocket
    String receiverId = receiver.getIdUtilisateur().toString();

    // Logique de validation des rôles
    if (("ENTREPRISE".equals(sender.getRole().name()) && "PARTICULIER".equals(receiver.getRole().name())) ||
            ("PARTICULIER".equals(sender.getRole().name()) && ("PRESTATAIRE".equals(receiver.getRole().name()) || "ENTREPRISE".equals(receiver.getRole().name())))) {

        // Logique spécifique si nécessaire
        messagingTemplate.convertAndSend("/topic/messages/" + receiverId, chatMessage);
    } else {
        throw new IllegalArgumentException("Invalid sender-receiver role combination");
    }
}

    public List<Message> getConversation(Long senderId, Long receiverId) {
       return messageRepository.findConversationBetweenUsers(senderId, receiverId);
   }

    public void markAsRead(Long id) {
        Message message = messageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Message not found"));

        // Met à jour le timestamp de lecture et marque le message comme livré
        message.setReadTimestamp(LocalDateTime.now());
        message.setDelivered(true);

        messageRepository.save(message);



    }








    public List<Message> getLastMessagesByUser(Long userId) {
        return messageRepository.findLastMessagesPerConversation(userId);
    }


}
