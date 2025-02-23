package com.example.backendnourpfe.Config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
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
/*
    private static final String[] WHITE_LIST_URL = {"/api/v1/auth/**"};

    private final JwtAuthenticat jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;
    private  final LogoutHandler logoutHandler;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(req -> req.requestMatchers("/**")
                        .permitAll()
                        .requestMatchers("/api/v1/auth/authenticate/","/forgetPassword/**").permitAll()
                        .requestMatchers(WHITE_LIST_URL).hasAnyRole("PARTICULIER")
                        .anyRequest().authenticated()

                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .logout(logout ->
                        logout.logoutUrl("/api/v1/auth/logout")
                                .addLogoutHandler(logoutHandler)
                                .logoutSuccessHandler((request, response, authentication) -> SecurityContextHolder.clearContext())
                )
        ;
        return http.build();
    }
*/
        private static final String[] WHITE_LIST_URL = {
                "/api/v1/auth/**", // On autorise toutes les requêtes d'authentification
                "/forgetPassword/**",
                        "/api/v1/auth/upload",
        "categories/**",
        "services/**"

        };

        private final JwtAuthenticat jwtAuthFilter;
        private final AuthenticationProvider authenticationProvider;
        private final LogoutHandler logoutHandler;

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

            http
                    .csrf(AbstractHttpConfigurer::disable)
                    .authorizeHttpRequests(req -> req
                            .requestMatchers(WHITE_LIST_URL).permitAll() // Autoriser l'authentification sans rôle
                            .anyRequest().authenticated() // Le reste nécessite une authentification
                    )
                    .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                    .authenticationProvider(authenticationProvider)
                    .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                    .logout(logout -> logout
                            .logoutUrl("/api/v1/auth/logout")
                            .addLogoutHandler(logoutHandler)
                            .logoutSuccessHandler((request, response, authentication) ->
                                    SecurityContextHolder.clearContext()
                            )
                    );
            return http.build();
        }
    }





