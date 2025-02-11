package com.example.backendnourpfe.service;


import com.example.backendnourpfe.classes.MailBody;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final   JavaMailSender javaMailSender;

    public EmailService(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }
    public void setJavaMailSender(MailBody mailBody){
        SimpleMailMessage message=new SimpleMailMessage();
        message.setTo(mailBody.to());
        message.setFrom("nourlass50@gmail.com");
        message.setSubject(mailBody.subject());
        message.setText(mailBody.text());


        javaMailSender.send(message);
    }
    public void sendVerificationEmailToprestatire(String to, String nom) {
        try {
            String subject = "Activation de votre compte SOS Job Tunisie";
            String message =
                    "<html>" +
                    "<head>" +
                    "<style>" +
                    "body { font-family: Arial, sans-serif; }" +
                    "h2 { color: #000000; }" +
                    "p { font-size: 16px; }" +
                    "strong { font-weight: bold; }" +
                    "</style>" +
                    "</head>" +
                    "<body>" +
                    "<h2>Bonjour " + nom + ",</h2>" +
                    "<p>Merci de vous être inscrit sur notre plateforme <strong>SOS Job Tunisie</strong>.</p>" +
                    "<p>Votre compte sera activé après vérification de vos documents.</p>" +
                    "<p>Nous allons vous contacter dans les prochains jours pour passer un entretien en ligne et discuter davantage de vos services.</p>" +
                    "<br>" +
                    "<p>Cordialement,</p>" +
                    "<p><strong>L'équipe SOS Job Tunisie</strong></p>" +
                    "</body>" +
                    "</html>";

            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(message, true); // true pour HTML
            helper.setFrom("nourlass50@gmail.com"); // Remplacez par votre email

            javaMailSender.send(mimeMessage);
        } catch (Exception e) {
            e.printStackTrace(); // Gérer l'exception selon vos besoins
        }
    }
    public void sendActivationEmail(String to, String nom) {
        try {
            String subject = "Activation de votre compte SOS Job Tunisie";
            String message =
                    "<html>" +
                            "<head>" +
                            "<style>" +
                            "body { font-family: Arial, sans-serif; }" +
                            "h2 { color: #000000; }" +
                            "p { font-size: 16px; }" +
                            "strong { font-weight: bold; }" +
                            "</style>" +
                            "</head>" +
                            "<body>" +
                            "<h2>Bonjour " + nom + ",</h2>" +
                            "<p>Bienvenue sur notre plateforme <strong>SOS Job Tunisie</strong> !</p>" +
                            "<p>Merci de vous être inscrit. Afin de finaliser votre inscription et activer votre compte, veuillez cliquer sur le bouton ci-dessous :</p>" +
                            "<p><a href='https://votre-site.com/api/utilisateurss/activation?email=" + to + "' class='button'>Activer mon compte</a></p>" +
                            "<p>Une fois votre compte activé, vous pourrez accéder à toutes les fonctionnalités de notre plateforme et profiter de nos services de manière instantanée.</p>" +
                            "<br>" +
                            "<p>Cordialement,</p>" +
                            "<p><strong>L'équipe SOS Job Tunisie</strong></p>" +
                            "</body>" +
                            "</html>";

            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(message, true); // true pour HTML
            helper.setFrom("nourlass50@gmail.com"); // Remplacez par votre email

            javaMailSender.send(mimeMessage);
        } catch (Exception e) {
            e.printStackTrace(); // Gérer l'exception selon vos besoins
        }
    }

}
