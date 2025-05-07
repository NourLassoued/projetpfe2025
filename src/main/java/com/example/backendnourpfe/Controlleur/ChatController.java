package com.example.backendnourpfe.Controlleur;

import com.example.backendnourpfe.Respository.MessageRepository;
import com.example.backendnourpfe.Respository.UtilisateurRepository;
import com.example.backendnourpfe.classes.Message;

import com.example.backendnourpfe.classes.Utilisateur;
import com.example.backendnourpfe.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/message")

@RequiredArgsConstructor

public class ChatController {
    @Autowired

    private MessageService messageService;
    @Autowired
    private MessageRepository messageRepository;
    @Autowired
    private  SimpMessagingTemplate messagingTemplate;


    @MessageMapping("/chat")

    public void sendMessagetempsreel(Message message) {

        message.setTimestamp(LocalDateTime.now());
        message.setDelivered(false);


        Message saved = messageRepository.save(message);

        messagingTemplate.convertAndSend(
                "/topic/messages/" + message.getReceiver().getIdUtilisateur(),
                saved
        );
    }



    @PostMapping("/send")
    public void sendMessage(@RequestBody Message chatMessage) {
        messageService.sendMessage(chatMessage);
    }



    @PostMapping("/mark-as-read/{messageId}")
    public void markMessageAsRead(@PathVariable Long messageId) {
        messageService.markAsRead(messageId);
    }

    @GetMapping("/undelivered/{receiverId}")
    public List<Message> getUndeliveredMessages(@PathVariable Long receiverId) {
        return messageService.getUndeliveredMessages(receiverId);
    }

    @GetMapping("/conversation/{senderId}/{receiverId}")
    public List<Message> getConversation(@PathVariable Long senderId, @PathVariable Long receiverId) {
        return messageService.getConversation(senderId, receiverId);
    }
    @GetMapping("/last/{userId}")
    public List<Message> getLastMessagesByUser(@PathVariable Long userId) {
        return messageService.getLastMessagesByUser(userId);
    }

}