package com.example.backendnourpfe.Controlleur;

import com.example.backendnourpfe.classes.Payment;
import com.example.backendnourpfe.service.FlouciService;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/payment")

public class PaymentController {


        @Autowired
        private FlouciService flouciService;

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
    public ResponseEntity<String> createPaymentForReservationEspace(@RequestParam Float amount, @PathVariable Long reservationId)  {
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
    }
