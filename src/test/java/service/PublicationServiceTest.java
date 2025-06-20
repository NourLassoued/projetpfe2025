package service;

import com.example.backendnourpfe.Respository.PublicationRepository;
import com.example.backendnourpfe.Respository.UtilisateurRepository;
import com.example.backendnourpfe.classes.Publication;
import com.example.backendnourpfe.classes.UserRole;
import com.example.backendnourpfe.classes.Utilisateur;
import com.example.backendnourpfe.service.EmailService;
import com.example.backendnourpfe.service.PublicationService;
import jakarta.mail.MessagingException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class PublicationServiceTest {

    private PublicationRepository publicationRepository;
    private UtilisateurRepository utilisateurRepository;
    private EmailService emailService;

    private PublicationService publicationService;

    @BeforeEach
    public void setUp() {
        publicationRepository = mock(PublicationRepository.class);
        utilisateurRepository = mock(UtilisateurRepository.class);
        emailService = mock(EmailService.class);

        publicationService = new PublicationService();
        publicationService.publicationRepository = publicationRepository;
        publicationService.utilisateurRepository = utilisateurRepository;
        publicationService.emailService = emailService;
    }

    @Test
    public void testAjouterPublication_envoieEmailAuxParticuliers() throws MessagingException {
        // Préparation des données
        Utilisateur entreprise = new Utilisateur();
        entreprise.setIdUtilisateur(1L);
        entreprise.setRole(UserRole.ENTREPRISE);
        entreprise.setNomEntreprise("Entreprise X");

        Publication publication = new Publication();
        publication.setTitre("Offre spéciale");
        publication.setDescription("Description de l'offre");

        Utilisateur particulier1 = new Utilisateur();
        particulier1.setIdUtilisateur(2L);
        particulier1.setRole(UserRole.PARTICULIER);
        particulier1.setNom("Jean Dupont");
        particulier1.setEmail("jean.dupont@example.com");

        Utilisateur particulier2 = new Utilisateur();
        particulier2.setIdUtilisateur(3L);
        particulier2.setRole(UserRole.PARTICULIER);
        particulier2.setNom("Marie Curie");
        particulier2.setEmail("marie.curie@example.com");

        // Mock des méthodes
        when(utilisateurRepository.findById(1L)).thenReturn(Optional.of(entreprise));
        when(publicationRepository.save(any(Publication.class))).thenAnswer(invocation -> {
            Publication pub = invocation.getArgument(0);
            pub.setId(10L);
            return pub;
        });
        when(utilisateurRepository.findByRole(UserRole.PARTICULIER)).thenReturn(List.of(particulier1, particulier2));

        LocalDate dateAvant = LocalDate.now();

        // Appel de la méthode testée
        Publication resultat = publicationService.ajouterPublication(publication, 1L);

        // Vérifications
        assertNotNull(resultat);
        assertEquals(10L, resultat.getId()); // <-- correction ici
        assertEquals(entreprise, resultat.getEntreprise());
        assertEquals(dateAvant, resultat.getDatePublication());

        // Vérifie que l'email a été envoyé 2 fois (pour chaque particulier)
        verify(emailService, times(2)).envoyerEmailConfirmation(anyString(), anyString(), anyString());

        // Capture des adresses email envoyées
        ArgumentCaptor<String> emailCaptor = ArgumentCaptor.forClass(String.class);
        verify(emailService, times(2)).envoyerEmailConfirmation(emailCaptor.capture(), anyString(), anyString());

        List<String> emailsEnvoyes = emailCaptor.getAllValues();
        assertTrue(emailsEnvoyes.contains("jean.dupont@example.com"));
        assertTrue(emailsEnvoyes.contains("marie.curie@example.com"));
    }
}