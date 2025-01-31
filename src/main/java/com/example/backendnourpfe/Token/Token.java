package com.example.backendnourpfe.Token;



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
    private  String token;
    @Enumerated(EnumType.STRING)
    private  TokenType tokenType;
    private  boolean  expired;
    private  boolean revoked;
    @ManyToOne
    @JoinColumn(name="user_id")
    private Utilisateur user;
}
