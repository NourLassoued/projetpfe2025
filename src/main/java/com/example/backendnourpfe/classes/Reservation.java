package com.example.backendnourpfe.classes;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idReservation;


    @Temporal(TemporalType.TIMESTAMP)
    private Date dateReservation;
    @Enumerated(EnumType.STRING)
    private StatusReservation statusReservation;


    @ManyToOne
    @JoinColumn(name = "particulier_id", nullable = false)
    private Utilisateur particulier;


    @ManyToOne
    @JoinColumn(name = "prestataire_id", nullable = false)
    private Utilisateur prestataire;

    @ManyToOne
    @JoinColumn(name = "demande_id", nullable = false)
    @JsonIgnoreProperties("reservations")
    private Demande demande;
    @OneToMany(mappedBy = "reservation")
    @JsonIgnoreProperties("reservation")
    private List<Payment> payments;
}

