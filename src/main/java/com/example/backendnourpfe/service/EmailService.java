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
    public void setJavaMailSender(MailBody mailBody) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(mailBody.to());
        message.setFrom("nourlass50@gmail.com");
        message.setSubject(mailBody.subject());
        message.setText(mailBody.text());

        javaMailSender.send(message);
    }

    // ✅ Méthode pour créer un MimeMessage
    public MimeMessage createMimeMessage() {
        return javaMailSender.createMimeMessage();
    }
    public void sendHtmlEmail(String to, String subject, String htmlContent) {
        try {
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);
            helper.setFrom("nourlass50@gmail.com");

            javaMailSender.send(mimeMessage);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void sendVerificationEmailToprestatire(String to, String nom) {
        try {
            String subject = "Activation de votre compte SOS Job Tunisie";

            String message =
                    "<html>" +
                            "<head>" +
                            "<style>" +
                            "body { font-family: Arial, sans-serif; background-color: #28a745; padding: 20px; }" +
                            ".email-container { background-color: #fbf5f5; max-width: 600px; margin: auto; padding: 30px; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); text-align: center; }" +
                            ".logo { font-size: 24px; font-weight: bold; color: #000; }" +
                            ".logo span { color: #ffcc00; }" +
                            "p { color: #333; font-size: 16px; line-height: 1.5; }" +
                            ".footer { font-size: 14px; color: #666; text-align: center; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 15px; }" +
                            ".footer a { color: #e63946; text-decoration: none; }" +
                            "</style>" +
                            "</head>" +
                            "<body>" +
                            "<div class='email-container'>" +
                            "<h2>Bonjour " + nom + ",</h2>" +
                            "<p>Merci de vous être inscrit sur notre plateforme <strong>SOS Job Tunisie</strong>.</p>" +
                            "<p>Votre compte sera activé après vérification de vos documents.</p>" +
                            "<p>Nous allons vous contacter dans les prochains jours pour passer un entretien en ligne et discuter davantage de vos services.</p>" +
                            "<br>" +
                            "<p>Cordialement,</p>" +
                            "<p><strong>L'équipe SOS Job Tunisie</strong></p>" +
                            "<div class='footer'>© 2025 SOS Job Tunisie - Tous droits réservés.</div>" +  // ✅ Pied de page
                            "</div>" +
                            "</body>" +
                            "</html>";

            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(message, true);
            helper.setFrom("nourlass50@gmail.com");

            javaMailSender.send(mimeMessage);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    public void sendActivationEmailParticulier(String to, String nom) {
        try {
            String subject = "Activation de votre compte SOS Job Tunisie";
            String activationLink = "http://localhost:8088/nour/utilisateurss/" + to;


            String message =
                    "<html>" +
                            "<head>" +
                            "<style>" +
                            "body { font-family: Arial, sans-serif; background-color: #28a745; padding: 20px; }" +
                            ".email-container { background-color: #fbf5f5; max-width: 600px; margin: auto; padding: 30px; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); }" +
                            ".logo { font-size: 24px; font-weight: bold; text-align: center; color: #000; }" +
                            ".logo span { color: #ffcc00; }" +
                            "p { color: #333; font-size: 16px; line-height: 1.5; }" +
                            ".button { display: inline-block; background-color: #28a745; color: #fff !important; padding: 12px 20px; text-decoration: none !important; font-size: 16px; font-weight: bold; border-radius: 5px; margin: 20px auto; }" +
                            ".button:hover { background-color: #218838; }" +
                            ".footer { font-size: 14px; color: #666; text-align: center; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 15px; }" +
                            ".footer a { color: #e63946; text-decoration: none; }" +
                            "</style>" +
                            "</head>" +
                            "<body>" +
                            "<div class='email-container'>" +
                            "<div class='logo'>SOS Job <span>Tunisie</span></div>" +
                            "<h2>Bonjour " + nom + ",</h2>" +
                            "<p>Merci de vous être inscrit sur <strong>SOS Job Tunisie</strong> !</p>" +
                            "<p>Pour activer votre compte, cliquez sur le bouton ci-dessous :</p>" +
                            "<p style='text-align: center;'><a href='" + activationLink + "' class='button'>Activer mon compte</a></p>" +
                            "<br>" +
                            "<p>Une fois votre compte activé, vous pourrez accéder à toutes les fonctionnalités de notre plateforme et profiter de nos services de manière instantanée.</p>" +
                            "<p>Cordialement,</p>" +
                            "<p><strong>L'équipe SOS Job Tunisie</strong></p>" +
                            "<div class='footer'>© 2025 SOS Job Tunisie - Tous droits réservés.</div>" +
                            "</div>" +
                            "</body>" +
                            "</html>";
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(message, true);
            helper.setFrom("nourlass50@gmail.com");

            javaMailSender.send(mimeMessage);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
