package service;

import com.example.backendnourpfe.Respository.AbonnementRepository;
import com.example.backendnourpfe.classes.Abonnement;
import com.example.backendnourpfe.classes.StatusAbonnement;
import com.example.backendnourpfe.classes.TypeAbonnement;
import com.example.backendnourpfe.service.AbonmentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

class AbonmentServiceTest {

    @Mock
    private AbonnementRepository abonnementRepository;

    @InjectMocks
    private AbonmentService abonmentService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAbonnementsMensuelEtAnnuelActifs() {
        // Préparer la donnée mockée
        List<Abonnement> mockAbonnements = Arrays.asList(new Abonnement(), new Abonnement());

        when(abonnementRepository.findByTypeAbonnementInAndStatusAbonnement(
                Arrays.asList(TypeAbonnement.MENSUEL, TypeAbonnement.ANNUEL),
                StatusAbonnement.ACTIF))
                .thenReturn(mockAbonnements);

        // Appeler la méthode à tester
        List<Abonnement> result = abonmentService.getAbonnementsMensuelEtAnnuelActifs();

        // Vérifier que le résultat est conforme
        assertEquals(2, result.size());
        verify(abonnementRepository, times(1))
                .findByTypeAbonnementInAndStatusAbonnement(
                        Arrays.asList(TypeAbonnement.MENSUEL, TypeAbonnement.ANNUEL),
                        StatusAbonnement.ACTIF);
    }

    // Tu peux ajouter d'autres tests pour les autres méthodes...
}