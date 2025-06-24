package com.example.backendnourpfe.auth;


import com.example.backendnourpfe.config.JwtService;
import com.example.backendnourpfe.respository.DisponibiliteRepository;
import com.example.backendnourpfe.respository.ServiceRepository;
import com.example.backendnourpfe.respository.UtilisateurRepository;
import com.example.backendnourpfe.token.Token;
import com.example.backendnourpfe.token.TokenRepository;
import com.example.backendnourpfe.token.TokenType;
import com.example.backendnourpfe.classes.*;
import com.example.backendnourpfe.service.EmailService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UtilisateurRepository repository;
    private  final TokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;
    private final ServiceRepository serviceRepository;
    private final DisponibiliteRepository disponibiliteRepository;




public AuthenticationReponse register(RegisterRequest request) {



        UserRole role = request.getRole();
        StatusUtilisateur status = request.getStatus();


        Utilisateur utilisateur = new Utilisateur();
        utilisateur.setNom(request.getNom());
        utilisateur.setEmail(request.getEmail());
        utilisateur.setPassword(passwordEncoder.encode(request.getPassword()));
        utilisateur.setImage(request.getImage());
        utilisateur.setTelephoneNumber(request.getTelephoneNumber());
        utilisateur.setRole(role);

        utilisateur.setCreatedAt(new Date());
        utilisateur.setCertification(request.getCertification());
        utilisateur.setTarifs(request.getTarifs());
        utilisateur.setDescription(request.getDescription());
        utilisateur.setSolde(request.getSolde());
        utilisateur.setDoucument_CIN(request.getDoucument_CIN());
        utilisateur.setDoucument_cv(request.getDoucument_cv());
        utilisateur.setStatus(status != null ? status : StatusUtilisateur.ATTENTE);
        utilisateur.setWorkExperience(request.getWorkExperience());
        utilisateur.setCompetence(request.getCompetence());
        utilisateur.setNomEntreprise(request.getNomEntreprise());
        utilisateur.setSiret(request.getSiret());
        utilisateur.setSiteWeb(request.getSiteWeb());
        utilisateur.setDemandes(request.getDemandes());
    if (request.getAdresse() != null) {
        Adresse adresse = new Adresse();
        adresse.setGovernoate(request.getAdresse().getGovernoate());
        adresse.setVille(request.getAdresse().getVille());
        utilisateur.setAdressee(adresse);
    }



    if (request.getCompetence() != null && !request.getCompetence().isEmpty()) {
            List<Servicee> services = serviceRepository.findByNomserviceIn(request.getCompetence());
            utilisateur.setServicesOfferts(services);
        }


        if (request.getDisponibilites() != null && !request.getDisponibilites().isEmpty()) {
            List<Disponibilite> disponibilites = new ArrayList<>();

            for (Disponibilite dispoDTO : request.getDisponibilites()) {
                Disponibilite disponibilite = new Disponibilite();
                disponibilite.setJour(dispoDTO.getJour());
                disponibilite.setHeureDebut(dispoDTO.getHeureDebut());
                disponibilite.setHeureFin(dispoDTO.getHeureFin());
                disponibilite.setPrestataire(utilisateur);
                disponibilites.add(disponibilite);
            }

            utilisateur.setDisponibilites(disponibilites);
        }


        Utilisateur saveUser = repository.save(utilisateur);


        if (saveUser.getDisponibilites() != null && !saveUser.getDisponibilites().isEmpty()) {
            disponibiliteRepository.saveAll(saveUser.getDisponibilites());
        }


        if (role == UserRole.PRESTATAIRE || role == UserRole.ENTREPRISE) {
            emailService.sendVerificationEmailToprestatire(utilisateur.getEmail(), utilisateur.getNom());
        } else if (role == UserRole.PARTICULIER) {
            emailService.sendActivationEmailParticulier(utilisateur.getEmail(), utilisateur.getNom());
        }


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
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
        } catch (BadCredentialsException ex) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email ou mot de passe incorrect.");
        }

        var user=repository.findByEmail(request.getEmail()).orElseThrow();

        var jwtToken = jwtService.generateToken(user);
        var refreshToken = jwtService.gererateRefershToken(user);

        revokeAllUserToken(user);
        saveUserToken(user, refreshToken);
        String message = null;
        if (user.getStatus() == StatusUtilisateur.ATTENTE) {
            message = "Votre compte est en attente de validation.";
        } else if (user.getStatus() == StatusUtilisateur.NONPAYE) {
            message = "Votre abonnement n'est pas payé. Veuillez régulariser votre paiement.";
        }

        saveUserToken(user,refreshToken);
        return  AuthenticationReponse.builder()
                .accesToken(jwtToken)
                .role(user.getRole())

                .status(user.getStatus())
                .message(message)
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

                    ObjectMapper objectMapper = new ObjectMapper();
                    objectMapper.writeValue(response.getOutputStream(), authResponse);
                }
            }
        }
    }



}
