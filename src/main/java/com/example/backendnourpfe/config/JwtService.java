package com.example.backendnourpfe.config;

import com.example.backendnourpfe.classes.Servicee;
import com.example.backendnourpfe.classes.Utilisateur;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class JwtService {

    @Value("${application.security.jwt.secret-key}")
    private String secretKey;
    @Value("${application.security.jwt.expiration}")
    private long jwtExpiration;
    @Value("${application.security.jwt.refresh-expiration}")
    private long refreshExpiration;

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }


    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }



    public String generateToken(Utilisateur user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("email", user.getEmail());
        claims.put("nom", user.getNom());
        claims.put("role", user.getRole());
        claims.put("status", user.getStatus());
        claims.put("telephoneNumber", user.getTelephoneNumber());
        claims.put("id", user.getIdUtilisateur());
        claims.put("workExperience", user.getWorkExperience());


        claims.put("adresse", user.getAdressee());

        claims.put("Demande",user.getDemandes());
        claims.put("tarifs", user.getTarifs());
        claims.put("description", Optional.ofNullable(user.getDescription()).orElse("no"));


        claims.put("services", Optional.ofNullable(user.getServicesOfferts())
                .orElse(Collections.emptyList())
                .stream()
                .map(Servicee::getNomservice)
                .collect(Collectors.toList()));

        claims.put("cin", Optional.ofNullable(user.getDoucument_CIN()).orElse("Non fourni"));
        claims.put("cv", Optional.ofNullable(user.getDoucument_cv()).orElse("Non fourni"));

        claims.put("solde", Optional.ofNullable(user.getSolde()).orElse(0.0F));


        claims.put("nomEntreprise", Optional.ofNullable(user.getNomEntreprise()).orElse("Particulier"));
        claims.put("siret", Optional.ofNullable(user.getSiret()).orElse("Non applicable"));
        claims.put("siteWeb", Optional.ofNullable(user.getSiteWeb()).orElse("Aucun site web"));
        claims.put("image", user.getImage());
        claims.put("disponibilites", Optional.ofNullable(user.getDisponibilites())
                .orElse(Collections.emptyList())
                .stream()
                .map(dispo -> Map.of(
                        "id", dispo.getId(),
                        "jour", dispo.getJour(),
                        "heureDebut", dispo.getHeureDebut().toString(),
                        "heureFin", dispo.getHeureFin().toString()

                ))
                .collect(Collectors.toList()));


        for (Servicee service : user.getServicesOfferts()) {
            System.out.println("   - " + service.getNomservice());
        }


        return buildToken(claims, user, jwtExpiration);
    }

    public String gererateRefershToken(
            UserDetails userDetails
    ) {
        return buildToken(new HashMap<>(), userDetails, refreshExpiration);
    }

    private String buildToken(
            Map<String, Object> extraClaims,
            UserDetails userDetails,
            long expiration
    ) {
        return Jwts
                .builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private Claims extractAllClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();

    }

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}