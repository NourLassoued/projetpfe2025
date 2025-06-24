package service;

import com.example.backendnourpfe.respository.*;
import com.example.backendnourpfe.classes.TypeAbonnement;
import com.example.backendnourpfe.classes.Utilisateur;

import com.example.backendnourpfe.service.FlouciService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Value;

import java.io.IOException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class FlouciServiceTest {

    @InjectMocks
    private FlouciService flouciService;


    @Mock
    private UtilisateurRepository utilisateurRepository;



    @Mock
    private ReservationRepository reservationRepository;



    @Mock
    private AbonnementRepository abonnementRepository;

    @Value("${flouci.public-token}")
    private String publicToken = "testPublicToken";

    @Value("${flouci.private-token}")
    private String privateToken = "testPrivateToken";



    @BeforeEach
    public void setup() {
        // Injection des tokens directement
        flouciService.publicToken = publicToken;
        flouciService.privateToken = privateToken;
    }

    @Test
    public void testCreatePaymentForReservation_reservationNotFound() throws IOException {
        Long fakeReservationId = 123L;

        when(reservationRepository.findById(fakeReservationId)).thenReturn(Optional.empty());

        String result = flouciService.createPaymentForReservation(100f, fakeReservationId);
        assertEquals("Reservation not found!", result);
    }

    // Un test plus complet simulerait la réponse Flouci, mais OkHttp n'est pas mocké ici, on peut faire un test "partiel" sur la logique métier

    @Test
    public void testADejaUtiliseGratuit_true() {
        String email = "test@example.com";

        Utilisateur user = new Utilisateur();
        when(utilisateurRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(abonnementRepository.existsByUtilisateurAndTypeAbonnement(user, TypeAbonnement.GRATUIT)).thenReturn(true);

        boolean result = flouciService.aDejaUtiliseGratuit(email);
        assertTrue(result);
    }

    @Test
    public void testADejaUtiliseGratuit_false() {
        String email = "test@example.com";

        Utilisateur user = new Utilisateur();
        when(utilisateurRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(abonnementRepository.existsByUtilisateurAndTypeAbonnement(user, TypeAbonnement.GRATUIT)).thenReturn(false);

        boolean result = flouciService.aDejaUtiliseGratuit(email);
        assertFalse(result);
    }

    @Test
    public void testADejaUtiliseGratuit_utilisateurNotFound() {
        String email = "inconnu@example.com";

        when(utilisateurRepository.findByEmail(email)).thenReturn(Optional.empty());

        Exception exception = assertThrows(RuntimeException.class, () -> {
            flouciService.aDejaUtiliseGratuit(email);
        });

        assertEquals("Utilisateur introuvable", exception.getMessage());
    }


}