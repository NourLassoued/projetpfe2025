package com.example.backendnourpfe.classes;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class Postulation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
private  String commentaire;
    private Date datePostulation = new Date();

    @ManyToOne
    @JoinColumn(name = "demande")
@JsonIgnoreProperties("postulations")
    private Demande demande;

    @ManyToOne
    @JoinColumn(name = "prestataire")

    @JsonIgnoreProperties("postulations")
    private Utilisateur prestataire;




}
