package com.example.backendnourpfe.classes;


import com.fasterxml.jackson.annotation.JsonFormat;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalTime;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity

public class Disponibilite {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String jour;

    @JsonFormat( pattern = "HH:mm")
    private LocalTime heureDebut;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime heureFin;

    @ManyToOne
    @JoinColumn(name = "prestataire_id", nullable = false)

    @JsonIgnoreProperties("disponibilites")
    private Utilisateur prestataire;


}
