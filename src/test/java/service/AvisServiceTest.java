package service;
import com.example.backendnourpfe.respository.AvisRepository;
import com.example.backendnourpfe.respository.UtilisateurRepository;
import com.example.backendnourpfe.classes.Avis;
import com.example.backendnourpfe.service.AvisService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AvisServiceTest {

    @Mock
    private AvisRepository avisRepository;

    @Mock
    private UtilisateurRepository utilisateurRepository;

    @InjectMocks
    private AvisService avisService;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCalculerScoreMoyen_WithAvis() {
        Long utilisateurId = 1L;
        List<Avis> avisList = new ArrayList<>();
        Avis avis1 = new Avis();
        avis1.setNote(4);
        Avis avis2 = new Avis();
        avis2.setNote(5);
        avisList.add(avis1);
        avisList.add(avis2);

        when(avisRepository.findByAvisUtilisateurIdUtilisateur(utilisateurId)).thenReturn(avisList);

        double score = avisService.calculerScoreMoyen(utilisateurId);

        // Calcul attendu : totalNotes = 9, nombreAvis=2, k=2, score = 9/(2+2) = 2.25 arrondi 2.3
        assertEquals(2.3, score, 0.1);
    }

    @Test
    void testCalculerScoreMoyen_NoAvis() {
        Long utilisateurId = 1L;
        when(avisRepository.findByAvisUtilisateurIdUtilisateur(utilisateurId)).thenReturn(Collections.emptyList());

        double score = avisService.calculerScoreMoyen(utilisateurId);

        assertEquals(0, score);
    }

    @Test
    void testUpdateAvis() {
        Long idAvis = 10L;
        Avis existingAvis = new Avis();
        existingAvis.setCommentaire("Ancien commentaire");
        existingAvis.setNote(3);
        existingAvis.setDateAvis(new Date());

        Avis updatedAvis = new Avis();
        updatedAvis.setCommentaire("Nouveau commentaire");
        updatedAvis.setNote(5);

        when(avisRepository.findById(idAvis)).thenReturn(Optional.of(existingAvis));
        when(avisRepository.save(any(Avis.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Avis result = avisService.updateAvis(idAvis, updatedAvis);

        assertEquals("Nouveau commentaire", result.getCommentaire());
        assertEquals(5, result.getNote());
        assertNotNull(result.getDateAvis());
        verify(avisRepository).save(existingAvis);
    }

    @Test
    void testUpdateAvis_NotFound() {
        Long idAvis = 10L;
        when(avisRepository.findById(idAvis)).thenReturn(Optional.empty());

        RuntimeException thrown = assertThrows(RuntimeException.class, () -> {
            avisService.updateAvis(idAvis, new Avis());
        });

        assertTrue(thrown.getMessage().contains("Avis non trouvé"));
    }
}