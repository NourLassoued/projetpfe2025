package com.example.backendnourpfe.classes;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Entity;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.Date;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@SuperBuilder

public class Prestataire extends  Utilisateur{
    @JsonProperty("competence")

    private String competence;
    @JsonProperty("tarifs")
    private float tarifs;
    @JsonProperty("disponibilite")
    private String disponibilite;
    @JsonProperty("description")
    private String description;

    @JsonProperty("about")
    private String about;
    @JsonProperty("solde")
    private float solde;

    // Constructeur avec paramètres
    public Prestataire(String nom, String email, String password, int telephoneNumber, UserRole role, String image,
                       String competence, float tarifs, String disponibilite, String description, String about, float solde, Date createdAt) {
        super(nom, email, password, image, telephoneNumber, role, createdAt);
        this.competence = competence;
        this.tarifs = tarifs;
        this.disponibilite = disponibilite;
        this.description = description;
        this.about = about;
        this.solde = solde;
    }




}
