package com.example.backendnourpfe.classes;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Servicee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idservice;
    private String nomservice;
    private String imageService;
    private String description;
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "categorie_id")
    private Categorie categorie;
    @JsonIgnore
    @OneToMany(mappedBy = "servicee")
    private List<Demande> demandes;
@JsonIgnore
@ManyToMany(mappedBy = "servicesOfferts")
private List<Utilisateur> prestataires;

}
