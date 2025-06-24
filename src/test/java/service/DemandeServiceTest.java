package service;

import com.example.backendnourpfe.respository.DemandeRepository;
import com.example.backendnourpfe.respository.PostulationRepository;
import com.example.backendnourpfe.respository.UtilisateurRepository;
import com.example.backendnourpfe.classes.*;

import com.example.backendnourpfe.service.AvisService;
import com.example.backendnourpfe.service.DemandeService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class DemandeServiceTest {

    @InjectMocks
    private DemandeService demandeService;

    @Mock
    private DemandeRepository demandeRepository;

    @Mock
    private UtilisateurRepository utilisateurRepository;

    @Mock
    private PostulationRepository postulationRepository;

    @Mock
    private AvisService avisService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void deleteDemande_shouldDeleteIfExists() {
        Demande demande = new Demande();
        demande.setIdDemande(1L);

        when(demandeRepository.findById(1L)).thenReturn(Optional.of(demande));

        demandeService.deleteDemande(1L);

        verify(demandeRepository, times(1)).delete(demande);
    }

    @Test
    void updateDemande_shouldUpdateFields() {
        Demande existing = new Demande();
        existing.setIdDemande(1L);
        existing.setDescription("Old");
        existing.setTitle("Old Title");

        Demande updates = new Demande();
        updates.setDescription("New Description");
        updates.setTitle("New Title");

        when(demandeRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(demandeRepository.save(any(Demande.class))).thenAnswer(i -> i.getArguments()[0]);

        Demande result = demandeService.updateDemande(1L, updates);

        assertEquals("New Description", result.getDescription());
        assertEquals("New Title", result.getTitle());
    }

    @Test
    void getAllDemandesByUtilisateurId_shouldReturnList() {
        Utilisateur user = new Utilisateur();
        user.setIdUtilisateur(10L);

        List<Demande> demandes = List.of(new Demande());

        when(utilisateurRepository.findById(10L)).thenReturn(Optional.of(user));
        when(demandeRepository.findByUtilisateurAndStatusDemandeAndDateAfter(
                eq(user), eq(StatusDemande.EN_COURS), any(Date.class)))
                .thenReturn(demandes);

        List<Demande> result = demandeService.getAllDemandesByUtilisateurId(10L);

        assertEquals(1, result.size());
    }

    @Test
    void getDemandeById_shouldReturnDemandeIfExists() {
        Demande demande = new Demande();
        demande.setIdDemande(5L);

        when(demandeRepository.findById(5L)).thenReturn(Optional.of(demande));

        Optional<Demande> found = demandeService.getDemandeById(5L);

        assertTrue(found.isPresent());
        assertEquals(5L, found.get().getIdDemande());
    }

}