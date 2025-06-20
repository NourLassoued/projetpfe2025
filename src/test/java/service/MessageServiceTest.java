package service;

import com.example.backendnourpfe.Respository.MessageRepository;
import com.example.backendnourpfe.Respository.UtilisateurRepository;
import com.example.backendnourpfe.classes.Message;
import com.example.backendnourpfe.classes.Utilisateur;
import  com.example.backendnourpfe.classes.UserRole;
import com.example.backendnourpfe.service.MessageService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class MessageServiceTest {

    @Mock
    private MessageRepository messageRepository;

    @Mock
    private UtilisateurRepository utilisateurRepository;

    @Mock
    private SimpMessagingTemplate messagingTemplate;

    @InjectMocks
    private MessageService messageService;

    private Utilisateur sender;
    private Utilisateur receiver;

    @BeforeEach
    public void setUp() {
        sender = new Utilisateur();
        sender.setIdUtilisateur(1L);
        sender.setRole(UserRole.PARTICULIER);

        receiver = new Utilisateur();
        receiver.setIdUtilisateur(2L);
        receiver.setRole(UserRole.PRESTATAIRE);
    }

    @Test
    public void testSendMessageSuccess() {
        Message msg = new Message();
        msg.setSender(sender);
        msg.setReceiver(receiver);
        msg.setContent("Hello");

        when(utilisateurRepository.findById(1L)).thenReturn(Optional.of(sender));
        when(utilisateurRepository.findById(2L)).thenReturn(Optional.of(receiver));
        when(messageRepository.save(any(Message.class))).thenAnswer(i -> i.getArgument(0));

        assertDoesNotThrow(() -> messageService.sendMessage(msg));

        verify(messageRepository, times(1)).save(any(Message.class));
        verify(messagingTemplate, times(1)).convertAndSend(eq("/topic/messages/2"), any(Message.class));
    }

    @Test
    public void testSendMessageInvalidRoleCombination() {
        sender.setRole(UserRole.ENTREPRISE);
        receiver.setRole(UserRole.PRESTATAIRE);

        Message msg = new Message();
        msg.setSender(sender);
        msg.setReceiver(receiver);
        msg.setContent("Hello");

        when(utilisateurRepository.findById(1L)).thenReturn(Optional.of(sender));
        when(utilisateurRepository.findById(2L)).thenReturn(Optional.of(receiver));

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            messageService.sendMessage(msg);
        });

        assertEquals("Invalid sender-receiver role combination", exception.getMessage());
    }

    @Test
    public void testGetUndeliveredMessagesMarksDeliveredWhenReadTimestampNotNull() {
        Message m1 = new Message();
        m1.setReadTimestamp(LocalDateTime.now());
        m1.setDelivered(false);

        Message m2 = new Message();
        m2.setReadTimestamp(null);
        m2.setDelivered(false);

        List<Message> messages = Arrays.asList(m1, m2);
        when(messageRepository.findByReceiverIdUtilisateurAndDeliveredFalse(2L)).thenReturn(messages);
        when(messageRepository.save(any(Message.class))).thenAnswer(i -> i.getArgument(0));

        List<Message> result = messageService.getUndeliveredMessages(2L);

        assertEquals(2, result.size());
        assertTrue(m1.isDelivered());
        assertFalse(m2.isDelivered());

        verify(messageRepository, times(1)).save(m1);
        verify(messageRepository, never()).save(m2);
    }

    @Test
    public void testMarkAsRead() {
        Message message = new Message();
        message.setId(1L);
        message.setDelivered(false);

        when(messageRepository.findById(1L)).thenReturn(Optional.of(message));
        when(messageRepository.save(any(Message.class))).thenAnswer(i -> i.getArgument(0));

        messageService.markAsRead(1L);

        assertTrue(message.isDelivered());
        assertNotNull(message.getReadTimestamp());

        verify(messageRepository, times(1)).save(message);
    }

    @Test
    public void testMarkAsReadThrowsExceptionIfNotFound() {
        when(messageRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            messageService.markAsRead(1L);
        });

        assertEquals("Message not found", exception.getMessage());
    }
}