package com.example.backendnourpfe.Config;

import com.example.backendnourpfe.classes.Utilisateur;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    @Value("9f340a0866f41d83a206c1ebab6ea555c0f314eeb089c5bce9de2d3ac4dd44a4")
    private String secretKey;
    @Value("${application.security.jwt.expiration}")
    private long jwtExpiration;
    @Value("604800000")
    private long refreshExpiration;

    public String extractUsername(String token) {
    return extractClaim(token, Claims::getSubject);
}


    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }/*

    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }
    public String generateToken(
            Map<String, Object> extraClaims,
            UserDetails userDetails
    ) {
        return buildToken(extraClaims, userDetails, jwtExpiration);
    }*/



    public String generateToken(Utilisateur user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", user.getRole());
        claims.put("status", user.getStatus());
        claims.put("telephoneNumber", user.getTelephoneNumber());
        claims.put("nomEntreprise", user.getNomEntreprise());
        claims.put("siret", user.getSiret());
        claims.put("siteWeb", user.getSiteWeb());
        claims.put("id", user.getIdUtilisateur());
        claims.put("email", user.getEmail());
        claims.put("role", user.getRole());
        claims.put("status", user.getStatus());
        claims.put("nom", user.getNom());

        claims.put("telephoneNumber", user.getTelephoneNumber());
        claims.put("adresse", user.getAdresse());
        claims.put("ville", user.getAdresse());

        claims.put("nomEntreprise", user.getNomEntreprise());
        claims.put("siret", user.getSiret());
        claims.put("siteWeb", user.getSiteWeb());
        claims.put("image", user.getImage());
        System.out.println("🖼 Image ajoutée au token: " + user.getImage());
        return buildToken(claims, user, jwtExpiration);
    }

    public String gererateRefershToken(
           UserDetails userDetails
    ) {
        return buildToken(new HashMap<>(),userDetails,refreshExpiration);
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
        private Key getSignInKey () {
            byte[] keyBytes = Decoders.BASE64.decode(secretKey);
            return Keys.hmacShaKeyFor(keyBytes);
        }

    }
