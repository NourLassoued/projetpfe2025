package com.example.backendnourpfe.auth;



import com.example.backendnourpfe.classes.StatusUtilisateur;
import com.example.backendnourpfe.classes.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest implements Serializable {

    private String nom;
    private String email;
    private String password;
    private int telephoneNumber;
    private String image;
    private UserRole role;
    private Date createdAt = new Date();


    private String Certification;
    private float tarifs;
    private String disponibilite;
    private String description;
    private float solde;
    private  String doucument_CIN;
    private  String doucument_cv;
    private StatusUtilisateur status;

    private int workExperience;
    private String nomEntreprise;
    private String siret;
    private String siteWeb;
    private List<String> servicesOfferts;
    private List<String> competence;
    private List<byte[]> images;
}