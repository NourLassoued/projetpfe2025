package com.example.backendnourpfe.classes;

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
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idReservation;

    @Temporal(TemporalType.TIMESTAMP)
    private Date dateReservation;
    @Enumerated(EnumType.STRING)
    private StatusReservation statusReservation;

    private String description;
    @ManyToOne
    @JoinColumn(name = "particulier_id", nullable = false)
    private Utilisateur particulier;


    @ManyToOne
    @JoinColumn(name = "prestataire_id", nullable = false)
    private Utilisateur prestataire;

}