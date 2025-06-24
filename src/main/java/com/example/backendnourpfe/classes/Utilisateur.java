package com.example.backendnourpfe.classes;



import com.example.backendnourpfe.token.Token  ;
import com.fasterxml.jackson.annotation.*;

import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.*;
import java.util.stream.Collectors;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

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
    private Integer telephoneNumber;
    private String badge;

    @Enumerated(EnumType.STRING)
    @JsonProperty("role")
    private UserRole role;

    @Enumerated(EnumType.STRING)
    private StatusUtilisateur status;
    @Temporal(TemporalType.TIMESTAMP)
    @JsonProperty("createdAt")
    private Date createdAt = new Date();

    @Nullable
    @JsonProperty("Certification")
    private String certification;

    @JsonProperty("tarifs")
    private Integer tarifs;

    @Nullable
    @JsonProperty("description")


    private String description;
    @Nullable
    @JsonProperty("competence")
    @ElementCollection

    private List<String> competence;
    @Nullable
    @JsonProperty("solde")

    private Float solde;
@Nullable
    @JsonProperty("workExperience")
    private Integer workExperience;
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
    @ElementCollection
    private List<Long> demandesDejaPostulees = new ArrayList<>();
    @JsonIgnore
    @OneToMany(mappedBy = "particulier")
    private List<Payment> paymentsAsParticulier;
    @JsonIgnore
    @OneToMany(mappedBy = "prestataire")
    private List<Payment> paymentsAsPrestataire;

    @JsonIgnore
    @OneToOne(mappedBy = "user")
    private ForgotPassword forgotPassword;
    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private  List<Token> tokens;
    @JsonIgnore
    @OneToMany(mappedBy = "utilisateur")

    private List<Demande> demandes;
    @JsonIgnore
    @OneToMany(mappedBy = "utilisateur")

    @JsonIgnoreProperties("utilisateur")
    private List<Avis> avisDonnes ;


    @OneToMany(mappedBy = "avisUtilisateur")
    @JsonIgnoreProperties("avisUtilisateur")
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
    @JsonManagedReference
    private List<Servicee> servicesOfferts =new ArrayList<>();


@JsonIgnore
@OneToMany(mappedBy = "prestataire", cascade = CascadeType.ALL, orphanRemoval = true)


@JsonIgnoreProperties("prestataire")
    private List<Disponibilite> disponibilites = new ArrayList<>();




    @ManyToOne(fetch = FetchType.EAGER)

    @JoinColumn(name = "adresse_id")


    @JsonIgnoreProperties("utilisateurs")
    private Adresse adressee;
    @JsonIgnore
    @OneToMany(mappedBy = "prestataire", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("prestataire")
    private List<Postulation> postulations;
    @JsonIgnore
    @OneToMany(mappedBy = "sender")
    private List<Message> messagesEnvoyes;
      @JsonIgnore
    @OneToMany(mappedBy = "receiver")
    private List<Message> messagesRecus;
      @JsonIgnore
    @OneToMany(mappedBy = "entreprise", cascade = CascadeType.ALL)
    private List<Publication> publications;
    @JsonIgnore
    @JsonIgnoreProperties("particulier")
    @OneToMany(mappedBy = "particulier", cascade = CascadeType.ALL)
    private List<Commentaire> commentaires;
    @JsonIgnore
    @OneToMany(mappedBy = "user")
    private List<Notification> notifications;
    @JsonIgnore
    @ManyToMany(mappedBy = "likedByUsers")
    private List<Publication> likedPublications;
    @JsonIgnore
    @OneToMany(mappedBy = "utilisateur", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("utilisateur")
    private List<Abonnement> abonnements;



    public Utilisateur(String nom, String email, String password, String image, int telephoneNumber, UserRole role, Date createdAt) {
        this.nom = nom;
        this.email = email;
        this.password = password;
        this.image = image;
        this.telephoneNumber = telephoneNumber;
        this.role = role;
        this.createdAt = (createdAt != null) ? createdAt : new Date();
    }

    public Utilisateur(Long idUtilisateur, UserRole role, Adresse adressee) {
        this.idUtilisateur = idUtilisateur;
       this.role=role;

        this.adressee = adressee;
    }

@JsonIgnore
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
    public List<Map<String, Object>> getDisponibilite() {
        return disponibilites != null ? disponibilites.stream().map(dispo -> {
            Map<String, Object> dispoMap = new HashMap<>();
            dispoMap.put("id", dispo.getId());
            dispoMap.put("jour", dispo.getJour());
            dispoMap.put("heureDebut", dispo.getHeureDebut().toString());
            dispoMap.put("heureFin", dispo.getHeureFin().toString());
            return dispoMap;
        }).collect(Collectors.toList()) : Collections.emptyList();
    }

}
