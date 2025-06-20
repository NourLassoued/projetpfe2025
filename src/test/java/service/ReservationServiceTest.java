package service;

import com.example.backendnourpfe.Respository.DemandeRepository;
import com.example.backendnourpfe.Respository.ReservationRepository;
import com.example.backendnourpfe.Respository.UtilisateurRepository;
import com.example.backendnourpfe.classes.*;
import com.example.backendnourpfe.service.EmailService;
import com.example.backendnourpfe.service.ReservationService;
import jakarta.mail.MessagingException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.util.Date;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ReservationServiceTest {

    @InjectMocks
    private ReservationService reservationService;

    @Mock
    private ReservationRepository reservationRepository;

    @Mock
    private UtilisateurRepository utilisateurRepository;

    @Mock
    private DemandeRepository demandeRepository;

    @Mock
    private EmailService emailService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreerReservation_Success() throws MessagingException {
        // Préparer les objets mocks
        Long idParticulier = 1L;
        Long idPrestataire = 2L;
        Long idDemande = 3L;

        Utilisateur particulier = new Utilisateur();
        particulier.setIdUtilisateur(idParticulier);
        particulier.setRole(UserRole.PARTICULIER);
        particulier.setNom("Jean Dupont");
        particulier.setEmail("jean@example.com");

        Utilisateur prestataire = new Utilisateur();
        prestataire.setIdUtilisateur(idPrestataire);
        prestataire.setRole(UserRole.PRESTATAIRE);
        prestataire.setNom("Prestataire ABC");
        prestataire.setEmail("prestataire@example.com");

        Servicee servicee = new Servicee();
        servicee.setNomservice("Plomberie");

        Demande demande = new Demande();
        demande.setIdDemande(idDemande);
        demande.setServicee(servicee);
        demande.setDate(new Date());
        demande.setHeureTravail(3);
        demande.setDescription("Réparation fuite");

        Reservation reservation = new Reservation();

        // Simuler les appels des repositories
        when(utilisateurRepository.findById(idParticulier)).thenReturn(Optional.of(particulier));
        when(utilisateurRepository.findById(idPrestataire)).thenReturn(Optional.of(prestataire));
        when(demandeRepository.findById(idDemande)).thenReturn(Optional.of(demande));
        when(reservationRepository.existsByPrestataireAndDemande(prestataire, demande)).thenReturn(false);
        when(reservationRepository.save(any(Reservation.class))).thenAnswer(invocation -> {
            Reservation res = invocation.getArgument(0);
            res.setIdReservation(5);
            return res;
        });

        // Appel de la méthode à tester
        Reservation resultat = reservationService.creerReservation(idParticulier, idPrestataire, idDemande, reservation);

        // Vérifications
        assertNotNull(resultat);
        assertEquals(particulier, resultat.getParticulier());
        assertEquals(prestataire, resultat.getPrestataire());
        assertEquals(demande, resultat.getDemande());
        assertEquals(StatusReservation.EN_ATTENTE, resultat.getStatusReservation());
        assertNotNull(resultat.getDateReservation());
        assertEquals(5, resultat.getIdReservation());

        // Vérifier qu'un email a bien été envoyé
        verify(emailService, times(1))
                .envoyerEmailConfirmation(eq(prestataire.getEmail()), anyString(), anyString());
    }


    @Test
    void testCreerReservation_Echec_RoleParticulierInvalide() {
        Long idParticulier = 1L;
        Long idPrestataire = 2L;
        Long idDemande = 3L;

        Utilisateur particulier = new Utilisateur();
        particulier.setRole(UserRole.PRESTATAIRE); // Mauvais rôle volontaire

        Utilisateur prestataire = new Utilisateur();
        prestataire.setRole(UserRole.PRESTATAIRE);

        Demande demande = new Demande(); // Créer une demande fictive

        // Mock des deux utilisateurs et de la demande
        when(utilisateurRepository.findById(idParticulier)).thenReturn(Optional.of(particulier));
        when(utilisateurRepository.findById(idPrestataire)).thenReturn(Optional.of(prestataire));
        when(demandeRepository.findById(idDemande)).thenReturn(Optional.of(demande)); // <-- Ajouté

        Exception exception = assertThrows(RuntimeException.class, () -> {
            reservationService.creerReservation(idParticulier, idPrestataire, idDemande, new Reservation());
        });

        assertEquals("Seul un utilisateur avec le rôle 'Particulier' peut réserver.", exception.getMessage());
    }
}
