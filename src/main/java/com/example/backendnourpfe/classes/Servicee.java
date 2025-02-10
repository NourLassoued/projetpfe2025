package com.example.backendnourpfe.classes;

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
    @ManyToOne
    @JoinColumn(name = "categorie_id")
    private Categorie categorie;
    @OneToMany(mappedBy = "servicee")
    private List<Demande> demandes;

    @OneToMany(mappedBy = "serviceeutilisateurs")
    private List<Utilisateur> utilisateurs;

}
