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
public class Avis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idAvis;

    private int note;
    private String commentaire;
    private Date dateAvis;
    @ManyToOne
    @JoinColumn(name = "utilisateur_id", nullable = false)
    @JsonIgnoreProperties("avisRecus")
    private Utilisateur utilisateur;

    @ManyToOne
    @JoinColumn(name = "avis_utilisateur_id", nullable = false)
    @JsonIgnoreProperties("avisDonnes")
    private Utilisateur avisUtilisateur;


}