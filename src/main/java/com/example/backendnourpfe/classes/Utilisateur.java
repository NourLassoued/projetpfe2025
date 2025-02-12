package com.example.backendnourpfe.classes;



import com.example.backendnourpfe.Token.Token;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Date;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString

public class Utilisateur  implements UserDetails  {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idUtilisateur;
    @JsonProperty("nom")
    private String nom;
    @JsonProperty("email")
    private String email;
    @JsonProperty("password")
    private String password;
    @JsonProperty("image")
    private String image;
    @JsonProperty("telephoneNumber")
    private int telephoneNumber;
    @JsonProperty("adresse")
    private  String adresse;

    @Enumerated(EnumType.STRING)
    @JsonProperty("role")
    private UserRole role;

    @Enumerated(EnumType.STRING)
    private StatusUtilisateur status=StatusUtilisateur.ATTENTE;
    @Temporal(TemporalType.TIMESTAMP)
    @JsonProperty("createdAt")
    private Date createdAt = new Date();

    @Nullable
    @JsonProperty("Certification")
    private String Certification;
    @Nullable
    @JsonProperty("tarifs")
    private float tarifs;
    @Nullable
    @JsonProperty("disponibilite")

    private String disponibilite;
    @Nullable
    @JsonProperty("description")

    private String description;
    @JsonProperty("solde")
    @Nullable
    private float solde;
    @JsonProperty("WorkExperience ")

    private String WorkExperience ;
    @JsonProperty("nomEntreprise")
    @Nullable
    private String nomEntreprise;
    @JsonProperty("siret")
    private String siret;
    @Nullable
    @JsonProperty("siteWeb")
    private String siteWeb;
    @Nullable
    @JsonProperty("doucument_cv")
    private  String doucument_cv;
    @Nullable
    @JsonProperty("doucument_CIN")
    private  String doucument_CIN;

@JsonIgnore
    @OneToOne(mappedBy = "user")
    private ForgotPassword forgotPassword;
    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private  List<Token> tokens;
    @OneToMany(mappedBy = "utilisateur")
    @JsonIgnore
    private List<Demande> demandes;
    @OneToMany(mappedBy = "utilisateur")
    @JsonIgnore
    private List<Avis> avisDonnes ;
    @JsonIgnore

    @OneToMany(mappedBy = "avisUtilisateur")
    private List<Avis> avisRecus ;
    @JsonIgnore

    @OneToMany(mappedBy = "particulier", cascade = CascadeType.ALL)
    private List<Reservation> reservationsEffectuees;
    @JsonIgnore


    @OneToMany(mappedBy = "prestataire", cascade = CascadeType.ALL)
    private List<Reservation> reservationsRecues;
@JsonIgnore
    @ManyToMany
    @JoinTable(
            name = "prestataire_service",
            joinColumns = @JoinColumn(name = "utilisateur_id"),
            inverseJoinColumns = @JoinColumn(name = "service_id")
    )
    private List<Servicee> servicesOfferts;
    public Utilisateur(String nom, String email, String password, String image, int telephoneNumber, UserRole role, Date createdAt) {
        this.nom = nom;
        this.email = email;
        this.password = password;
        this.image = image;
        this.telephoneNumber = telephoneNumber;
        this.role = role;
        this.createdAt = (createdAt != null) ? createdAt : new Date();
    }


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return  List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
