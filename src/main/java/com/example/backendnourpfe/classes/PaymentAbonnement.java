package com.example.backendnourpfe.classes;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaymentAbonnement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String paymentId;

    @Enumerated(EnumType.STRING)
    private StatusPayment paymentStatus;

    private float amount;

    @OneToOne
    @JoinColumn(name = "abonnement_id", nullable = false, unique = true)
    @JsonIgnoreProperties("paymentAbonnement")
    private Abonnement abonnement;
}