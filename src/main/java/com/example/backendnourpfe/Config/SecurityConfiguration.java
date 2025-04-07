package com.example.backendnourpfe.Config;

import lombok.RequiredArgsConstructor;
import org.apache.catalina.filters.CorsFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.List;


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
            "/avis/**"

    };

    private final JwtAuthenticat jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;
    private  final LogoutHandler logoutHandler;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http

                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(req -> req

                        .requestMatchers(WHITE_LIST_URL).permitAll()
                        .requestMatchers(HttpMethod.POST, "/utilisateurss/**").permitAll()

                       .requestMatchers(HttpMethod.PUT, "/demandes/**").permitAll()



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
    //2versoin
/*
        private static final String[] WHITE_LIST_URL = {
                "/api/v1/auth/**", // On autorise toutes les requêtes d'authentification
                "/forgetPassword/**",
                        "/api/v1/auth/upload",
                         "/categories/**",
                           "/services/**",





        };

        private final JwtAuthenticat jwtAuthFilter;
        private final AuthenticationProvider authenticationProvider;
        private final LogoutHandler logoutHandler;
      @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

            http
                    .csrf(AbstractHttpConfigurer::disable)
                    .authorizeHttpRequests(req -> req

                            .requestMatchers(WHITE_LIST_URL).permitAll()
                            .requestMatchers(HttpMethod.POST, "/api/v1/auth/authenticate").permitAll()

                            .anyRequest().authenticated()
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
        }*/
    /*
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
            .csrf(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(req -> req.anyRequest().permitAll()) // 🔥 Désactive toutes les restrictions
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
*/






