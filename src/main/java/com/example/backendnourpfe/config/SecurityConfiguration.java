package com.example.backendnourpfe.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutHandler;



@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity(securedEnabled = true)
public class SecurityConfiguration {

    private static final String[] WHITE_LIST_URL = {"/api/v1/auth/**", "/forgetPassword/**", "/categories/**",
            "/services/**","/utilisateurss/**","/disponibilites/**" ,"/adresses/**",
            "/demandes/**",
            "/reservation/**",
            "/postulation/**",
            "/avis/**",
            "/notifications/**",
            "/message/**",
            "/payment/**",
            "/ws/**",
            "/publications/**",
            "/commentaires/**",
            "/notification/**",
            "/AbonmentS/**",
            "/chatbot/**"




    };

    private final JwtAuthenticat jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;
    private  final LogoutHandler logoutHandler;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http

                // Désactivation de CSRF car l'application utilise des JWT (stateless)
                // Aucun cookie de session n'est utilisé pour l'authentification
                .csrf(AbstractHttpConfigurer::disable)   // NOSONAR
                .authorizeHttpRequests(req -> req

                        .requestMatchers(WHITE_LIST_URL).permitAll()
                        .requestMatchers(HttpMethod.POST, "/utilisateurss/**").permitAll()

                       .requestMatchers(HttpMethod.PUT, "/demandes/**").permitAll()

                        .requestMatchers("/ws/**").permitAll()

                        .requestMatchers(HttpMethod.POST, "/api/v1/auth/authenticate").permitAll()
                       .anyRequest().authenticated()
             //  .anyRequest().permitAll()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .logout(logout -> logout
                        .logoutUrl("/api/v1/auth/logout")
                        .addLogoutHandler(logoutHandler)
                        .logoutSuccessHandler((request, response, authentication) ->
                                SecurityContextHolder.clearContext())
                );

        return http.build();
    }



}






