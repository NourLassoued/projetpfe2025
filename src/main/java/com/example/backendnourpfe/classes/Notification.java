package com.example.backendnourpfe.classes;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private boolean isSeen;


    @ManyToOne
    @JoinColumn(name = "user_id")
    private Utilisateur user;

    @ManyToOne

    @JoinColumn(name = "publication_id", nullable = false)
    private Publication publication;


}