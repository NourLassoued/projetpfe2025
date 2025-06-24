package service;


import com.example.backendnourpfe.service.UtilisateurService;
import org.mockito.InjectMocks;
import com.example.backendnourpfe.respository.*;
import com.example.backendnourpfe.classes.*;
import com.example.backendnourpfe.config.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;


import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
class UtilisateurServiceTest {

    @InjectMocks
    private UtilisateurService utilisateurService;

    @Mock
    private UtilisateurRepository utilisateurRepository;
    @Mock
    private AdresseRepository adresseRepository;



    @Mock
    private JwtService jwtService;



    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testAjouterUtilisateur() {
        Utilisateur utilisateur = new Utilisateur();
        utilisateur.setNom("Test Nom");
        when(utilisateurRepository.save(utilisateur)).thenReturn(utilisateur);

        Utilisateur result = utilisateurService.ajouterUtilisateur(utilisateur);

        assertEquals("Test Nom", result.getNom());
        verify(utilisateurRepository, times(1)).save(utilisateur);
    }

    @Test
    void testDeleteUser() {
        utilisateurService.deleteUser(1L);
        verify(utilisateurRepository, times(1)).deleteById(1L);
    }

    @Test
    void testCheckEmailExists() {
        when(utilisateurRepository.existsByEmail("test@email.com")).thenReturn(true);

        boolean exists = utilisateurService.checkEmailExists("test@email.com");

        assertTrue(exists);
        verify(utilisateurRepository, times(1)).existsByEmail("test@email.com");
    }

    @Test
    void testAffecterAdresse() {
        Utilisateur user = new Utilisateur();
        Adresse adresse = new Adresse();
        adresse.setIdAdresse(1L);
        user.setIdUtilisateur(1L);
        when(utilisateurRepository.findById(1L)).thenReturn(Optional.of(user));
        when(adresseRepository.findById(1L)).thenReturn(Optional.of(adresse));
        when(utilisateurRepository.save(any(Utilisateur.class))).thenReturn(user);
        when(jwtService.generateToken(user)).thenReturn("fakeToken");

        Map<String, Object> result = utilisateurService.affecterAdresse(1L, 1L);

        assertEquals("Adresse affectée avec succès !", result.get("message"));
        assertEquals("fakeToken", result.get("token"));
        assertEquals(user, result.get("user"));
    }

    @Test
    void testGetUtilisateurById() {
        Utilisateur user = new Utilisateur();
        user.setIdUtilisateur(10L);
        when(utilisateurRepository.findById(10L)).thenReturn(Optional.of(user));

        Optional<Utilisateur> found = utilisateurService.getUtilisateurById(10L);

        assertTrue(found.isPresent());
        assertEquals(10L, found.get().getIdUtilisateur());
    }
}
