package service;


import com.example.backendnourpfe.Config.JwtService;
import com.example.backendnourpfe.Respository.*;
import com.example.backendnourpfe.Token.TokenRepository;
import com.example.backendnourpfe.auth.AuthenticationReponse;
import com.example.backendnourpfe.auth.AuthenticationService;
import com.example.backendnourpfe.auth.RegisterRequest;
import com.example.backendnourpfe.classes.*;
import com.example.backendnourpfe.service.EmailService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.ArrayList;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AuthenticationServiceTest {

    @Mock
    private UtilisateurRepository utilisateurRepository;

    @Mock
    private TokenRepository tokenRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private EmailService emailService;

    @Mock
    private ServiceRepository serviceRepository;

    @Mock
    private DisponibiliteRepository disponibiliteRepository;

    @InjectMocks
    private AuthenticationService authenticationService;
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        // injection manuelle si nécessaire
        ReflectionTestUtils.setField(authenticationService, "emailService", emailService);
    }



    @Test
    void testRegister_shouldReturnAuthenticationResponse() {
        // Préparer les données d'entrée
        RegisterRequest request = new RegisterRequest();
        request.setNom("Nour");
        request.setEmail("nour@example.com");
        request.setPassword("password");
        request.setRole(UserRole.PARTICULIER);
        request.setStatus(StatusUtilisateur.ATTENTE);
        request.setCompetence(new ArrayList<>());
        request.setDisponibilites(new ArrayList<>());

        // Mock comportement du password encoder
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");

        // Mock save utilisateur
        Utilisateur savedUser = new Utilisateur();
        savedUser.setIdUtilisateur(1L);
        savedUser.setEmail(request.getEmail());
        savedUser.setNom(request.getNom());
        savedUser.setRole(request.getRole());
        when(utilisateurRepository.save(any(Utilisateur.class))).thenReturn(savedUser);

        // Mock génération token
        when(jwtService.generateToken(any(Utilisateur.class))).thenReturn("token");

        // Mock sauvegarde token
        when(tokenRepository.save(any())).thenReturn(null);

        // Appeler la méthode à tester
        AuthenticationReponse response = authenticationService.register(request);

        // Vérifications
        assertNotNull(response);
        assertEquals("token", response.getAccesToken());
        assertEquals("token", response.getRefershToken());

        // Vérifier que save a été appelé
        verify(utilisateurRepository, times(1)).save(any(Utilisateur.class));
        verify(jwtService, times(2)).generateToken(any(Utilisateur.class));
    }
}
