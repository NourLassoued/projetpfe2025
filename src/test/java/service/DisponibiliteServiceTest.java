package service;

import com.example.backendnourpfe.config.JwtService;
import com.example.backendnourpfe.respository.DisponibiliteRepository;
import com.example.backendnourpfe.respository.UtilisateurRepository;
import com.example.backendnourpfe.classes.Disponibilite;
import com.example.backendnourpfe.classes.Utilisateur;

import com.example.backendnourpfe.service.DisponibiliteService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.time.LocalTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class DisponibiliteServiceTest {

    @InjectMocks
    private DisponibiliteService disponibiliteService;

    @Mock
    private DisponibiliteRepository disponibiliteRepository;

    @Mock
    private UtilisateurRepository utilisateurRepository;

    @Mock
    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void ajouterDisponibilite_shouldAddAndReturnToken() {
        Long prestataireId = 1L;
        Utilisateur prestataire = new Utilisateur();
        prestataire.setIdUtilisateur(prestataireId);

        Disponibilite dispo = new Disponibilite();
        dispo.setJour("Lundi");
        dispo.setHeureDebut(LocalTime.of(9, 0));
        dispo.setHeureFin(LocalTime.of(12, 0));

        when(utilisateurRepository.findById(prestataireId)).thenReturn(Optional.of(prestataire));
        when(disponibiliteRepository.save(any(Disponibilite.class))).thenAnswer(i -> i.getArguments()[0]);
        when(jwtService.generateToken(prestataire)).thenReturn("token123");

        Map<String, Object> result = disponibiliteService.ajouterDisponibilite(prestataireId, dispo);

        assertNotNull(result.get("disponibilite"));
        assertEquals("token123", result.get("token"));
        verify(disponibiliteRepository, times(1)).save(any(Disponibilite.class));
    }

    @Test
    void supprimerDisponibilite_shouldDeleteAndReturnToken() {
        Long dispoId = 2L;
        Utilisateur prestataire = new Utilisateur();
        prestataire.setIdUtilisateur(3L);

        Disponibilite dispo = new Disponibilite();
        dispo.setId(dispoId);
        dispo.setPrestataire(prestataire);

        when(disponibiliteRepository.findById(dispoId)).thenReturn(Optional.of(dispo));
        doNothing().when(disponibiliteRepository).delete(dispo);
        when(disponibiliteRepository.existsById(dispoId)).thenReturn(false);
        when(jwtService.generateToken(prestataire)).thenReturn("newToken");

        Map<String, Object> response = disponibiliteService.supprimerDisponibilite(dispoId);

        assertEquals("Disponibilité supprimée avec succès !", response.get("message"));
        assertEquals("newToken", response.get("token"));
        verify(disponibiliteRepository, times(1)).delete(dispo);
    }

    @Test
    void modifierDisponibilite_shouldModifyAndReturnToken() {
        Long dispoId = 4L;
        Utilisateur prestataire = new Utilisateur();
        prestataire.setIdUtilisateur(5L);

        Disponibilite existingDispo = new Disponibilite();
        existingDispo.setId(dispoId);
        existingDispo.setJour("Mardi");
        existingDispo.setHeureDebut(LocalTime.of(8, 0));
        existingDispo.setHeureFin(LocalTime.of(10, 0));
        existingDispo.setPrestataire(prestataire);

        Disponibilite newDispo = new Disponibilite();
        newDispo.setJour("Mercredi");
        newDispo.setHeureDebut(LocalTime.of(9, 0));
        newDispo.setHeureFin(LocalTime.of(11, 0));

        when(disponibiliteRepository.findById(dispoId)).thenReturn(Optional.of(existingDispo));
        when(disponibiliteRepository.save(existingDispo)).thenReturn(existingDispo);
        when(jwtService.generateToken(prestataire)).thenReturn("tokenModified");

        Map<String, Object> result = disponibiliteService.modifierDisponibilite(dispoId, newDispo);

        assertEquals("Mercredi", ((Disponibilite)result.get("disponibilite")).getJour());
        assertEquals(LocalTime.of(9, 0), ((Disponibilite)result.get("disponibilite")).getHeureDebut());
        assertEquals("tokenModified", result.get("token"));
    }

    @Test
    void getDisponibilitesByPrestataire_shouldReturnList() {
        Long prestataireId = 6L;
        Disponibilite dispo1 = new Disponibilite();
        Disponibilite dispo2 = new Disponibilite();

        List<Disponibilite> disponibilites = Arrays.asList(dispo1, dispo2);

        when(disponibiliteRepository.findByPrestataire_IdUtilisateur(prestataireId)).thenReturn(disponibilites);

        List<Disponibilite> result = disponibiliteService.getDisponibilitesByPrestataire(prestataireId);

        assertEquals(2, result.size());
    }
}