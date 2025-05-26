package com.example.backendnourpfe.classes;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Abonnement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idAbonnement;

    @Enumerated(EnumType.STRING)
    private TypeAbonnement typeAbonnement;

    @Temporal(TemporalType.TIMESTAMP)
    private Date dateDebut;

    @Temporal(TemporalType.TIMESTAMP)
    private Date dateFin;

    @Enumerated(EnumType.STRING)
    private StatusAbonnement statusAbonnement;

    private Float montant;

    private Boolean autoRenouvellement = false;

    @ManyToOne
    @JoinColumn(name = "utilisateur_id", nullable = false)
    @JsonIgnoreProperties("abonnements")
    private Utilisateur utilisateur;
    @OneToOne(mappedBy = "abonnement", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("abonnement")
    private PaymentAbonnement paymentAbonnement;


}