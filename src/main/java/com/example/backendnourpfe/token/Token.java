package com.example.backendnourpfe.token;



import com.example.backendnourpfe.classes.Utilisateur;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

@Builder
public class Token {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private  Integer id;
    @Column(length = 1000)
    private  String token;
    @Enumerated(EnumType.STRING)
    private  TokenType tokenType;
    private  boolean  expired;
    private  boolean revoked;
    @ManyToOne
    @JoinColumn(name="user_id")
    private Utilisateur user;
}
