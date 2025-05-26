package com.example.backendnourpfe.Respository;

import com.example.backendnourpfe.classes.Abonnement;
import com.example.backendnourpfe.classes.PaymentAbonnement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentAbonnementRepository extends JpaRepository<PaymentAbonnement, Long> {


    PaymentAbonnement findByPaymentId(String paymentId);


    PaymentAbonnement findByAbonnement(Abonnement abonnement);


    boolean existsByAbonnementIdAbonnement(Long abonnementId);
}