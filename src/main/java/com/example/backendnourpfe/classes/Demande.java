package com.example.backendnourpfe.classes;


import com.fasterxml.jackson.annotation.JsonIgnore;
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
public class Demande {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idDemande;
    private Date date;
    private String description;
    private  String title;

    private String adresse;
    @Enumerated(EnumType.STRING)
    private StatusDemande statusDemande;
    private  int heureTravail;
    private  String demandephoto;
@JsonIgnore
    @ManyToOne
    @JoinColumn(name = "utilisateur_id")
    private Utilisateur utilisateur;
@JsonIgnore
    @ManyToOne
    @JoinColumn(name = "service_id")
    private Servicee servicee;

}
