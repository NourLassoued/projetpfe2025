package com.example.backendnourpfe.Controlleur;


import com.example.backendnourpfe.Respository.ForgetPasswordRepository;
import com.example.backendnourpfe.Respository.UtilisateurRepository;
import com.example.backendnourpfe.classes.ChangePassword;
import com.example.backendnourpfe.classes.ForgotPassword;

import com.example.backendnourpfe.classes.Utilisateur;
import com.example.backendnourpfe.service.EmailService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Date;
import java.util.Objects;
import java.util.Random;


@CrossOrigin(origins = "*")

@RestController
@RequestMapping("/forgetPassword")
public class ForgetPasswordController {
    private final PasswordEncoder passwordEncoder;
    private final UtilisateurRepository utlisateurRepo;
    private final EmailService emailService;
    private final ForgetPasswordRepository forgetPasswordRepository;

    public ForgetPasswordController(
            PasswordEncoder passwordEncoder,
            UtilisateurRepository utlisateurRepo,
            EmailService emailService,
            ForgetPasswordRepository forgetPasswordRepository
    ) {
        this.passwordEncoder = passwordEncoder;
        this.utlisateurRepo = utlisateurRepo;
        this.emailService = emailService;
        this.forgetPasswordRepository = forgetPasswordRepository;
    }
@PostMapping("/verifyMail/{email}")
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
                + ".button { display: inline-block; background-color: #28a745; color: #fff !important; padding: 12px 20px; text-decoration: none !important; font-size: 16px; font-weight: bold; border-radius: 5px; margin: 20px auto; }"
               + ".button:hover { background-color: #218838; }"
                + ".footer { font-size: 14px; color: #666; text-align: center; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 15px; }"
                + ".footer a { color: #e63946; text-decoration: none; }"
                + "</style>"
                + "</head>"
                + "<body>"
                + "<div class='email-container'>"
                + "<div class='logo'>Ring<span>SOS Service  Tunisie </span></div>"
                + "<p>Bonjour " + user.getNom() + ",</p>"
                + "<p>Pour réinitialiser votre mot de passe, merci de cliquer sur le lien ci-dessous :</p>"
                + "<p style='text-align: center;'><a href='http://localhost:4200/editpassword?id=" + userId + "' class='button'>Réinitialiser mon mot de passe</a></p>"

                + "<p>Si vous n'avez pas demandé de réinitialisation, merci d'ignorer cet e-mail et votre mot de passe restera inchangé.</p>"
                + "<p>Merci,</p>"
                + "<p>L'équipe SOS Service  Tunisie </p>"
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
        Utilisateur user = utlisateurRepo.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Please provide a valid email"));

        ForgotPassword fp = forgetPasswordRepository.findByOtpAndUtlisateur(otp, user)
                .orElseThrow(() -> new RuntimeException("Invalid OTP for email"));

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
    @PostMapping("/changePassword/{id}")
    public ResponseEntity<String> changePasswordHandler(@RequestBody ChangePassword changePassword, @PathVariable Long id) {
        try {
            if (!Objects.equals(changePassword.password(), changePassword.repeatPassword())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Les mots de passe ne correspondent pas. Veuillez réessayer !");
            }

            Utilisateur user = utlisateurRepo.findById(id)
                    .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé avec cet ID"));

            String encodedPassword = passwordEncoder.encode(changePassword.password());

            utlisateurRepo.updatePassword(user.getEmail(), encodedPassword);

            return ResponseEntity.ok("Le mot de passe a été modifié avec succès !");
        } catch (UsernameNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur lors du changement de mot de passe : " + ex.getMessage());
        }
    }


}