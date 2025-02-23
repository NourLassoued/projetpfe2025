package com.example.backendnourpfe.Controlleur;


import com.example.backendnourpfe.Respository.ForgetPasswordRepository;
import com.example.backendnourpfe.Respository.UtilisateurRepository;
import com.example.backendnourpfe.classes.ChangePassword;
import com.example.backendnourpfe.classes.ForgotPassword;
import com.example.backendnourpfe.classes.MailBody;
import com.example.backendnourpfe.classes.Utilisateur;
import com.example.backendnourpfe.service.EmailService;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Date;
import java.util.Objects;
import java.util.Random;
import java.util.UUID;

@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@RestController
@RequestMapping("/forgetPassword")
public class ForgetPasswordController {
    @Autowired
    private  PasswordEncoder passwordEncoder;
    @Autowired
    private UtilisateurRepository utlisateurRepo;
    @Autowired
    private EmailService emailService;
    @Autowired
    private ForgetPasswordRepository forgetPasswordRepository;
/*@PostMapping("/verifyMail/{email}")
public ResponseEntity<String> verifyEmail(@PathVariable String email) {
    try {
        // Rechercher l'utilisateur par email
        Utilisateur user = utlisateurRepo.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Please provide a valid email !"));

        // Générer un OTP
        int otp =OtpGenrator();

        // Préparer le contenu du mail
        MailBody mailBody = MailBody.builder()
                .to(email)
                .text("This is the OTP for your Forget Password: " + otp)
                .subject("OTP for Forget Password request")
                .build();

        // Sauvegarder l'OTP dans la base de données
        ForgotPassword fp = ForgotPassword.builder()
                .otp(otp)
                .expirationTime(new Date(System.currentTimeMillis() + 70 * 1000))
                .user(user)
                .build();
        forgetPasswordRepository.save(fp);

        // Envoyer l'email
        emailService.setJavaMailSender(mailBody);

        // Retourner une réponse de confirmation
        return ResponseEntity.ok("Email sent for verification!");
    } catch (UsernameNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    } catch (Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error sending email: " + ex.getMessage());
    }
}*/@PostMapping("/verifyMail/{email}")
public ResponseEntity<String> verifyEmail(@PathVariable String email) {
    try {

        Utilisateur user = utlisateurRepo.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Veuillez entrer une adresse e-mail valide !"));
        Long userId = user.getIdUtilisateur();
        String emailContent = "<html>"
                + "<head>"
                + "<style>"
                + "body { font-family: Arial, sans-serif; background-color: #28a745; padding: 20px; }"
                + ".email-container { background-color: #fbf5f5; max-width: 600px; margin: auto; padding: 30px; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); }"
                + ".logo { font-size: 24px; font-weight: bold; text-align: center; color: #000; }"
                + ".logo span { color: #ffcc00; }"
                + "p { color: #333; font-size: 16px; line-height: 1.5; }"
                + ".button { display: inline-block; background-color:  #28a745; color:  #ffcc00; padding: 12px 20px; text-decoration: none; font-size: 16px; font-weight: bold; border-radius: 5px; margin: 20px auto; }"
                + ".footer { font-size: 14px; color: #666; text-align: center; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 15px; }"
                + ".footer a { color: #e63946; text-decoration: none; }"
                + "</style>"
                + "</head>"
                + "<body>"
                + "<div class='email-container'>"
                + "<div class='logo'>Ring<span>Twice</span></div>"
                + "<p>Bonjour " + user.getNom() + ",</p>"
                + "<p>Pour réinitialiser votre mot de passe, merci de cliquer sur le lien ci-dessous :</p>"
                + "<p style='text-align: center;'><a href='http://localhost:4200/editpassword?id=" + userId + "' class='button'>Réinitialiser mon mot de passe</a></p>"

                + "<p>Si vous n'avez pas demandé de réinitialisation, merci d'ignorer cet e-mail et votre mot de passe restera inchangé.</p>"
                + "<p>Merci,</p>"
                + "<p>L'équipe Ring Twice</p>"
                + "<div class='footer'>Besoin d'aide ? Trouvez votre réponse <a href='#'>ici</a> ou <a href='#'>contactez-nous</a>.</div>"
                + "</div>"
                + "</body>"
                + "</html>";



        emailService.sendHtmlEmail(email, "Réinitialisation de votre mot de passe", emailContent);

        return ResponseEntity.ok("E-mail envoyé avec succès !");
    } catch (UsernameNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    } catch (Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur lors de l'envoi de l'e-mail : " + ex.getMessage());
    }
}


    @PostMapping("/verifyOtp/{otp}/{email}")
public ResponseEntity<String> verifyOtp(@PathVariable Integer otp, @PathVariable String email) {
    try {
        // Rechercher l'utilisateur par email
        Utilisateur user = utlisateurRepo.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Please provide a valid email"));

        // Rechercher l'entrée OTP correspondante dans la base de données
        ForgotPassword fp = forgetPasswordRepository.findByOtpAndUtlisateur(otp, user)
                .orElseThrow(() -> new RuntimeException("Invalid OTP for email"));

        // Vérifier si l'OTP a expiré
        if (fp.getExpirationTime().before(Date.from(Instant.now()))) {
            forgetPasswordRepository.deleteById(fp.getFpid());
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body("OTP has expired!");
        }

        // Supprimer l'entrée OTP après vérification réussie (optionnel)
        forgetPasswordRepository.deleteById(fp.getFpid());

        // Retourner une réponse de confirmation
        return ResponseEntity.ok("OTP verified!");
    } catch (UsernameNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    } catch (RuntimeException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    } catch (Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error verifying OTP: " + ex.getMessage());
    }
}
    @PostMapping("/changePassword/{email}")
    public ResponseEntity<String> changePasswordHandler(@RequestBody ChangePassword changePassword, @PathVariable String email) {
        try {
            if (!Objects.equals(changePassword.password(), changePassword.repeatPassword())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Passwords do not match. Please try again!");
            }

            String encodedPassword = passwordEncoder.encode(changePassword.password());
            utlisateurRepo.updatePassword(email, encodedPassword);
            return ResponseEntity.ok("Password has been changed!");
        } catch (UsernameNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error changing password: " + ex.getMessage());
        }
    }
    private Integer OtpGenrator(){
        Random random =new Random();
        return random.nextInt(100_000,999_999);
    }
}