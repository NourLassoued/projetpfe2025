package service;

import com.example.backendnourpfe.classes.MailBody;
import com.example.backendnourpfe.service.EmailService;
import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import static org.mockito.Mockito.*;

class EmailServiceTest {

    @Mock
    private JavaMailSender javaMailSender;

    @InjectMocks
    private EmailService emailService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testSetJavaMailSender_sendsSimpleMail() {
        MailBody mailBody = mock(MailBody.class);
        when(mailBody.to()).thenReturn("destinataire@example.com");
        when(mailBody.subject()).thenReturn("Sujet test");
        when(mailBody.text()).thenReturn("Contenu test");

        doNothing().when(javaMailSender).send(any(SimpleMailMessage.class));

        emailService.setJavaMailSender(mailBody);

        verify(javaMailSender, times(1)).send(any(SimpleMailMessage.class));
    }

    @Test
    void testEnvoyerEmailConfirmation_sendsMimeMessage() throws Exception {
        MimeMessage mimeMessage = mock(MimeMessage.class);

        when(javaMailSender.createMimeMessage()).thenReturn(mimeMessage);
        doNothing().when(javaMailSender).send(mimeMessage);

        emailService.envoyerEmailConfirmation("destinataire@example.com", "Sujet confirmation", "<p>Contenu</p>");

        verify(javaMailSender, times(1)).createMimeMessage();
        verify(javaMailSender, times(1)).send(mimeMessage);
    }

    @Test
    void testSendHtmlEmail_sendsMimeMessage() {
        MimeMessage mimeMessage = mock(MimeMessage.class);
        when(javaMailSender.createMimeMessage()).thenReturn(mimeMessage);
        doNothing().when(javaMailSender).send(mimeMessage);

        emailService.sendHtmlEmail("test@example.com", "Sujet HTML", "<h1>Bonjour</h1>");

        verify(javaMailSender, times(1)).createMimeMessage();
        verify(javaMailSender, times(1)).send(mimeMessage);
    }

    @Test
    void testSendVerificationEmailToprestatire_sendsMimeMessage() {
        MimeMessage mimeMessage = mock(MimeMessage.class);
        when(javaMailSender.createMimeMessage()).thenReturn(mimeMessage);
        doNothing().when(javaMailSender).send(mimeMessage);

        emailService.sendVerificationEmailToprestatire("prestataire@example.com", "Nour");

        verify(javaMailSender, times(1)).createMimeMessage();
        verify(javaMailSender, times(1)).send(mimeMessage);
    }

    @Test
    void testSendActivationEmailParticulier_sendsMimeMessage() {
        MimeMessage mimeMessage = mock(MimeMessage.class);
        when(javaMailSender.createMimeMessage()).thenReturn(mimeMessage);
        doNothing().when(javaMailSender).send(mimeMessage);

        emailService.sendActivationEmailParticulier("user@example.com", "Nour");

        verify(javaMailSender, times(1)).createMimeMessage();
        verify(javaMailSender, times(1)).send(mimeMessage);
    }
}
