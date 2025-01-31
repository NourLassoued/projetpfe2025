package com.example.backendnourpfe.classes;



import com.example.backendnourpfe.Token.Token;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Date;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@SuperBuilder
@Inheritance(strategy = InheritanceType.JOINED)
public class Utilisateur  implements UserDetails  {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idUtilisateur;
    @JsonProperty("nom")
    private String nom;
    @JsonProperty("email")
    private String email;
    @JsonProperty("password")
    private String password;
    @JsonProperty("image")
    private String image;
    @JsonProperty("telephoneNumber")
    private int telephoneNumber;

    @Enumerated(EnumType.STRING)
    @JsonProperty("role")
    private UserRole role;
    @Temporal(TemporalType.TIMESTAMP)
    @JsonProperty("createdAt")
    private Date createdAt = new Date();
    @JsonProperty("enabled")
    private boolean enabled ;
    @OneToOne(mappedBy = "user")
    private ForgotPassword forgotPassword;
    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private  List<Token> tokens;
    public Utilisateur(String nom, String email, String password, String image, int telephoneNumber, UserRole role, Date createdAt) {
        this.nom = nom;
        this.email = email;
        this.password = password;
        this.image = image;
        this.telephoneNumber = telephoneNumber;
        this.role = role;
        this.createdAt = (createdAt != null) ? createdAt : new Date(); // Si `createdAt` est null, mettre la date actuelle
    }


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return  List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
