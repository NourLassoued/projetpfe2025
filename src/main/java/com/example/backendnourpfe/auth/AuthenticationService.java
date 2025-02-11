package com.example.backendnourpfe.auth;


import com.example.backendnourpfe.Config.JwtService;
import com.example.backendnourpfe.Respository.UtilisateurRepository;
import com.example.backendnourpfe.Token.Token;
import com.example.backendnourpfe.Token.TokenRepository;
import com.example.backendnourpfe.Token.TokenType;
import com.example.backendnourpfe.classes.*;
import com.example.backendnourpfe.service.EmailService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

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
    @Autowired
    private EmailService emailService;



public AuthenticationReponse register(RegisterRequest request) {
    UserRole role = request.getRole();
    StatusPrestataire status;
    if (role == UserRole.PRESTATAIRE || role == UserRole.ENTREPRISE) {

        status = StatusPrestataire.ATTENTE; // Si prestataire ou entreprise, statut "attente"
    } else {
        status = StatusPrestataire.ATTENTE; // Si particulier, statut "accepté"
    }

    Utilisateur utilisateur = new Utilisateur();
    utilisateur.setNom(request.getNom());
    utilisateur.setEmail(request.getEmail());
    utilisateur.setPassword(passwordEncoder.encode(request.getPassword()));
    utilisateur.setImage(request.getImage());
    utilisateur.setTelephoneNumber(request.getTelephoneNumber());
    utilisateur.setRole(role);
    utilisateur.setCreatedAt(new Date());
    utilisateur.setCompetence(request.getCompetence());
    utilisateur.setTarifs(request.getTarifs());
    utilisateur.setDisponibilite(request.getDisponibilite());
    utilisateur.setDescription(request.getDescription());
    utilisateur.setSolde(request.getSolde());
    utilisateur.setDoucument_CIN(request.getDoucument_CIN());
    utilisateur.setDoucument_cv(request.getDoucument_cv());
    utilisateur.setStatus(status); // Assignation du status
    utilisateur.setAbout(request.getAbout());
    utilisateur.setNomEntreprise(request.getNomEntreprise());
    utilisateur.setSiret(request.getSiret());
    utilisateur.setSiteWeb(request.getSiteWeb());

    if (role == UserRole.PRESTATAIRE || role == UserRole.ENTREPRISE) {
        emailService.sendVerificationEmailToprestatire(utilisateur.getEmail(), utilisateur.getNom());
    }
    if (role == UserRole.PARTICULIER) {

        emailService.sendActivationEmail(utilisateur.getEmail(), utilisateur.getNom());
    }
    Utilisateur saveUser = repository.save(utilisateur);


    String jwtToken = jwtService.generateToken(utilisateur);
    String refreshToken = jwtService.generateToken(utilisateur);


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
        if (user.getStatus() == StatusPrestataire.ATTENTE) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Votre compte est en attente de validation.");
        }

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
