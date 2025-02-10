package com.example.backendnourpfe.auth;



import com.example.backendnourpfe.classes.StatusPrestataire;
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


    private String competence;
    private float tarifs;
    private String disponibilite;
    private String description;
    private float solde;
    private  String doucument_CIN;
    private  String doucument_cv;
    private StatusPrestataire status;

    private String about;
    private String nomEntreprise;
    private String siret;
    private String siteWeb;
    private List<byte[]> images;
}