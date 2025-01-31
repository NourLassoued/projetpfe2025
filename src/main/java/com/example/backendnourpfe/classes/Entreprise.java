package com.example.backendnourpfe.classes;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.Date;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@SuperBuilder
public class Entreprise extends  Utilisateur {
    @JsonProperty("solde")
    private float solde;
    @JsonProperty("about")
    private String about;
    @JsonProperty("nomEntreprise")
    private String nomEntreprise;
    @JsonProperty("siret")
    private String siret;
    @JsonProperty("siteWeb")
    private String siteWeb;
    @ElementCollection
    @JsonProperty("images")
    private List<byte[]> images;

    public Entreprise(String nom, String email, String password, String image, int telephoneNumber, UserRole role, float solde, String about, String nomEntreprise, String siret, String siteWeb, List<byte[]> images, Date createdAt) {
        super(nom, email, password, image, telephoneNumber, role, createdAt);
        this.solde = solde;
        this.about = about;
        this.nomEntreprise = nomEntreprise;
        this.siret = siret;
        this.siteWeb = siteWeb;
        this.images = images;
    }
}


