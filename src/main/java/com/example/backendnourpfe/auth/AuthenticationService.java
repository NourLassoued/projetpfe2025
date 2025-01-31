package com.example.backendnourpfe.auth;


import com.example.backendnourpfe.Config.JwtService;
import com.example.backendnourpfe.Respository.UtilisateurRepository;
import com.example.backendnourpfe.Token.Token;
import com.example.backendnourpfe.Token.TokenRepository;
import com.example.backendnourpfe.Token.TokenType;
import com.example.backendnourpfe.classes.Entreprise;
import com.example.backendnourpfe.classes.Prestataire;
import com.example.backendnourpfe.classes.UserRole;
import com.example.backendnourpfe.classes.Utilisateur;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Date;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UtilisateurRepository repository;
    private  final TokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;



public AuthenticationReponse register(RegisterRequest request) {
    UserRole role = request.getRole();
    if (role == null) {
        role = UserRole.getDefaultRole();
    }

    Utilisateur utilisateur;

    if (role == UserRole.ENTREPRISE) {
        utilisateur = Entreprise.builder()
                .nom(request.getNom())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .telephoneNumber(request.getTelephoneNumber())
                .role(role)
                .image(request.getImage())
                .solde(request.getSolde())
                .about(request.getAbout())
                .nomEntreprise(request.getNomEntreprise())
                .siret(request.getSiret())
                .siteWeb(request.getSiteWeb())
                .images(request.getImages())
                .createdAt(new Date())

                .build();
    } else if (role == UserRole.PRESTATAIRE) {
        utilisateur = Prestataire.builder()
                .nom(request.getNom())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .telephoneNumber(request.getTelephoneNumber())
                .role(role)
                .image(request.getImage())
                .competence(request.getCompetence())
                .tarifs(request.getTarifs())
                .disponibilite(request.getDisponibilite())
                .description(request.getDescription())
                .about(request.getAbout())
                .solde(request.getSolde())
                .createdAt(new Date())
                .build();
    } else {
        utilisateur = new Utilisateur(
                request.getNom(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                request.getImage(),
                request.getTelephoneNumber(),
                role,
                new Date()
        );

    }

    var saveUser = repository.save(utilisateur);
    var jwtToken = jwtService.generateToken(utilisateur);
    var refreshToken = jwtService.gererateRefershToken(utilisateur);
    saveUserToken(saveUser, jwtToken);

    return AuthenticationReponse.builder()
            .accesToken(jwtToken)
            .refershToken(refreshToken)
            .build();
}


    private  void  revokeAllUserToken(Utilisateur user){
        var valideToken=tokenRepository.findAllValidTokensByUtlisateur(user.getIdUtilisateur());
        if(valideToken.isEmpty())
            return;
        valideToken.forEach(t->{
            t.setExpired(true);
            t.setRevoked(true);
        });
        tokenRepository.saveAll(valideToken);
    }
    private void saveUserToken(Utilisateur user, String jwtToken) {
        var token = Token.builder()
                .user(user)
                .token(jwtToken)
                .tokenType(TokenType.BEARER)
                .revoked(false)
                .expired(false)
                .build();
        tokenRepository.save(token);
    }

    public AuthenticationReponse autheticate (AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        var user=repository.findByEmail(request.getEmail()).orElseThrow();
        var jwtToken=jwtService.generateToken(user);
        var refershToken=jwtService.gererateRefershToken(user);
        System.out.println("Role of logged user : " + user.getRole());
        System.out.println("token of logged user : " + jwtToken);
        revokeAllUserToken(user);

        saveUserToken(user,refershToken);
        return  AuthenticationReponse.builder()
                .accesToken(jwtToken)
                .role(user.getRole())
                .build();
    }
    public void refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException {
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        String refreshToken;
        String userEmail;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            refreshToken = authHeader.substring(7);
            userEmail = jwtService.extractUsername(refreshToken);

            if (userEmail != null) {
                Utilisateur userDetails = repository.findByEmail(userEmail).orElseThrow();

                if (jwtService.isTokenValid(refreshToken, userDetails)) {
                    String accessToken = jwtService.generateToken(userDetails);
                    revokeAllUserToken(userDetails);
                    saveUserToken(userDetails, accessToken);

                    AuthenticationReponse authResponse = AuthenticationReponse.builder()
                            .accesToken(accessToken)
                            .refershToken(refreshToken)
                            .build();

                    // Écrire la réponse JSON dans le corps de la réponse HTTP
                    ObjectMapper objectMapper = new ObjectMapper();
                    objectMapper.writeValue(response.getOutputStream(), authResponse);
                }
            }
        }
    }



}
