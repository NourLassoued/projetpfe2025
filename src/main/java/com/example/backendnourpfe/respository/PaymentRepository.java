package com.example.backendnourpfe.respository;

import com.example.backendnourpfe.classes.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Payment findByPaymentId(String paymentId);

    List<Payment> findByParticulierIdUtilisateurOrPrestataireIdUtilisateur(Long particulierId, Long prestataireId);
}
