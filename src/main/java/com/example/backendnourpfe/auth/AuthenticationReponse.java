package com.example.backendnourpfe.auth;



import com.example.backendnourpfe.classes.UserRole;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationReponse {
    @JsonProperty("access_token")
    private  String accesToken;

    @JsonProperty("refersh_token")
    private String refershToken;
    private UserRole role;
    private int telephoneNumber;
    private String image;
    private float solde;  // Par exemple, pour Entreprise ou Prestataire
    private String about; // Pour Entreprise ou Prestataire
    private String nomEntreprise;  // Pour Entreprise uniquement
    private String siret;  // Pour Entreprise uniquement
    private String siteWeb;  // Pour Entreprise uniquement
    private String competence; // Pour Prestataire uniquement
    private float tarifs; // Pour Prestataire uniquement
    private String disponibilite; // Pour Prestataire uniquement
    private String description; // Pour Prestataire uniquement
}
