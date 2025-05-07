package com.example.backendnourpfe.classes;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;



@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity

public class Adresse {
     @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
     @JsonProperty("idAdresse")
    private Long idAdresse;
    @JsonProperty("governoate")
    private  String governoate;
    @JsonProperty("ville")
    private String ville;


    @OneToMany(mappedBy = "adressee")

    @JsonIgnoreProperties("adressee")
    private List<Utilisateur> utilisateurs;

@JsonIgnore
    @OneToMany(mappedBy = "adressedemande", cascade = CascadeType.ALL)

    private List<Demande> demandes;
}

