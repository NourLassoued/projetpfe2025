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
public class Categorie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nom;
    private String description;
    private String imageCategorie;
    private Float tarif;
    @OneToMany(mappedBy = "categorie",cascade = CascadeType.ALL)
    private List<Servicee> services;
}