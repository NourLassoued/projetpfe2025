package com.example.backendnourpfe.respository;

import com.example.backendnourpfe.classes.PaymentAbonnement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentAbonnementRepository extends JpaRepository<PaymentAbonnement, Long> {


    PaymentAbonnement findByPaymentId(String paymentId);




}