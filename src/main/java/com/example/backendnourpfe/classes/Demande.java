package com.example.backendnourpfe.classes;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;



import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Demande {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idDemande;
    private Date date;
    private String description;
    private  String title;
    private Integer telephoneNumber;

    @Enumerated(EnumType.STRING)
    private StatusDemande statusDemande;
    private  Integer heureTravail;
    private  String demandephoto;

@ManyToOne(fetch = FetchType.EAGER)
@JoinColumn(name = "utilisateur_id")

    private Utilisateur utilisateur;

@ManyToOne(fetch = FetchType.EAGER)

@JoinColumn(name = "service_id")

    private Servicee servicee;

@ManyToOne(fetch = FetchType.EAGER)

@JoinColumn(name = "adresse_id")

    private Adresse adressedemande;
    @JsonIgnoreProperties("demande")
    @OneToMany(mappedBy = "demande", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Postulation> postulations = new ArrayList<>();

    @OneToMany(mappedBy = "demande", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("demande")
    private List<Reservation> reservations = new ArrayList<>();

}
