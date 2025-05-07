package com.example.backendnourpfe.classes;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data

public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Utilisateur sender;
    @ManyToOne


    private Utilisateur receiver;

    private String content;

    private LocalDateTime timestamp;

    private boolean delivered;
    private LocalDateTime readTimestamp;

}
