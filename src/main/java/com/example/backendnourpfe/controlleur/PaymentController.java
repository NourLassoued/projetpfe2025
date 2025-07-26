package com.example.backendnourpfe.controlleur;

import com.example.backendnourpfe.classes.Payment;
import com.example.backendnourpfe.classes.TypeAbonnement;
import com.example.backendnourpfe.service.FlouciService;
import jakarta.mail.MessagingException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/payment")

public class PaymentController {

    private final FlouciService flouciService;
    private static final Logger logger = LoggerFactory.getLogger(PaymentController.class);

    public PaymentController(FlouciService flouciService) {
        this.flouciService = flouciService;
    }

    @PostMapping("/create/{reservationId}")
    public ResponseEntity<String> createPayment(@PathVariable("reservationId") Long reservationId, @RequestParam("amount") Float amount) {
        try {
            String responseString = flouciService.createPaymentForReservation(amount, reservationId);
            return ResponseEntity.ok(responseString);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error while processing payment: " + e.getMessage());
        }
    }

    @GetMapping("/verify/{paymentId}")
    public String verifyPayment(@PathVariable String paymentId) {
        try {

            return flouciService.verifyPayment(paymentId);
        } catch (Exception e) {
            return "Error verifying payment: " + e.getMessage();
        }
    }

    @PostMapping("/create-payment/{reservationId}")
    public ResponseEntity<String> createPaymentForReservationEspace(@RequestParam Float amount, @PathVariable Long reservationId) {
        try {
            String responseString = flouciService.createPaymentForReservationEspace(amount, reservationId);
            return ResponseEntity.ok(responseString);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error while processing payment: " + e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    public List<Payment> getPaymentsByUser(@PathVariable Long userId) {
        return flouciService.getPaymentsByUser(userId);
    }

    @GetMapping("/verify-abonnement/{paymentId}")
    public ResponseEntity<String> verifyAbonnementPayment(@PathVariable String paymentId) {
        try {
            String result = flouciService.verifyPaymentAbonnement(paymentId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur : " + e.getMessage());
        }
    }

    @PostMapping("/abonnement")
    public ResponseEntity<String> createAbonnementPayment(
            @RequestParam String email,
            @RequestParam TypeAbonnement type
    ) {
        try {
            String redirectUrl = flouciService.createPaymentForAbonnement(email, type);
            return ResponseEntity.ok(redirectUrl);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Erreur lors de la création du paiement : " + e.getMessage());
        }
    }

    @GetMapping("/test-email-bienvenue")
    public String testEnvoyerEmailBienvenue(@RequestParam String email) {
        try {
            flouciService.envoyerEmailBienvenue(email);
            return "Email de bienvenue envoyé avec succès à " + email;
        } catch (MessagingException e) {
            logger.error("Erreur lors de l'envoi de l'email à {} : {}", email, e.getMessage(), e);
            return "Erreur lords de l'envoi de l'email : " + e.getMessage();
        }
    }

    @PostMapping("/abonnement/gratuit")
    public ResponseEntity<?> activerAbonnementGratuit(@RequestParam String email) {
        flouciService.activerGratuit(email);
        return ResponseEntity.ok("Compte activé gratuitement");
    }

    @GetMapping("/verifier")
    public String testVerifierAbonnements() {
        flouciService.verifierAbonnementsExpirés();
        return "Vérification abonnements lancée";
    }

    @GetMapping("/a-deja-utilise-gratuit")
    public ResponseEntity<Boolean> aDejaUtiliseGratuit(@RequestParam String email) {
        try {
            boolean dejaUtilise = flouciService.aDejaUtiliseGratuit(email);
            return ResponseEntity.ok(dejaUtilise);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(false);
        }
    }

}
