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
    @JsonProperty("role")
    private UserRole role;
    @JsonProperty("telephoneNumber")
    private Integer telephoneNumber;
    @JsonProperty("image")
    private String image;
    @JsonProperty("solde")
    private Float solde;
    @JsonProperty("about")
    private String about;
    @JsonProperty("nomEntreprise")
    private String nomEntreprise;
    @JsonProperty("siret")
    private String siret;
    @JsonProperty("siteWeb")
    private String siteWeb;
    @JsonProperty("competence")
    private String competence;
    @JsonProperty("tarifs")
    private Float tarifs;

    @JsonProperty("description")
    private String description;
    @JsonProperty("status")
    private StatusUtilisateur status;
    @JsonProperty("workExperience")
    private Integer workExperience;

}
