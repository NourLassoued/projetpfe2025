package com.example.backendnourpfe.auth;



import com.example.backendnourpfe.classes.StatusUtilisateur;
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
    private float solde;
    private String about;
    private String nomEntreprise;
    private String siret;
    private String siteWeb;
    private String competence;
    private float tarifs;
    private String disponibilite;
    private String description;
    private StatusUtilisateur status;
}
