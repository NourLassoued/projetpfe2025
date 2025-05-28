package com.example.backendnourpfe.classes;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;
import lombok.*;


import java.util.Date;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Commentaire {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String contenu;
    @Temporal(TemporalType.TIMESTAMP)
    private Date dateCommentaire;


    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "publication_id")
    private Publication publication;

    @ManyToOne
    @JoinColumn(name = "particulier_id")
@JsonIgnoreProperties("commentaires")

    private Utilisateur particulier;
}
