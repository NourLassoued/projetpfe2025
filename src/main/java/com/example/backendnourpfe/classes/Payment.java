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
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idpaymemnt;
    private String paymentId;
    private String modePaiement;
    @Enumerated(EnumType.STRING)
    private StatusPayment paymentStatus;

    private float amount;

    @ManyToOne
    @JoinColumn(name = "reservation_id", nullable = false)
    @JsonIgnoreProperties("payments")
    private Reservation reservation;

    @ManyToOne
    @JoinColumn(name = "particulier_id", nullable = false)
    private Utilisateur particulier;

    @ManyToOne
    @JoinColumn(name = "prestataire_id", nullable = false)
    private Utilisateur prestataire;

}