package com.example.backendnourpfe.classes;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Publication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titre;
    private String description;

    private LocalDate datePublication;

    @ManyToOne
    @JoinColumn(name = "entreprise_id")
    private Utilisateur entreprise;
@JsonIgnore
    @OneToMany(mappedBy = "publication", cascade = CascadeType.ALL)
    private List<Commentaire> commentaires;
@JsonIgnore
@OneToMany(mappedBy = "publication", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Notification> notifications;
}
