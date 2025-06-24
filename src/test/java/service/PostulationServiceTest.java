package service;

import com.example.backendnourpfe.respository.DemandeRepository;
import com.example.backendnourpfe.respository.PostulationRepository;
import com.example.backendnourpfe.respository.UtilisateurRepository;
import com.example.backendnourpfe.classes.Demande;
import com.example.backendnourpfe.classes.Postulation;
import com.example.backendnourpfe.classes.UserRole;
import com.example.backendnourpfe.classes.Utilisateur;

import com.example.backendnourpfe.service.PostulationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class PostulationServiceTest {

    private PostulationRepository postulationRepository;
    private DemandeRepository demandeRepository;
    private UtilisateurRepository utilisateurRepository;

    private PostulationService postulationService;

    @BeforeEach
    void setup() {
        postulationRepository = mock(PostulationRepository.class);
        demandeRepository = mock(DemandeRepository.class);
        utilisateurRepository = mock(UtilisateurRepository.class);

        postulationService = new PostulationService();
        postulationService.postulationRepository = postulationRepository;
        postulationService.demandeRepository = demandeRepository;
        postulationService.utilisateurRepository = utilisateurRepository;
    }

    @Test
    void testPostuler_success() {
        Long demandeId = 1L;
        Long utilisateurId = 2L;

        Utilisateur demandeur = new Utilisateur();
        demandeur.setIdUtilisateur(10L);

        Demande demande = new Demande();
        demande.setIdDemande(demandeId);
        demande.setUtilisateur(demandeur);
        demande.setPostulations(new ArrayList<>());

        Utilisateur prestataire = new Utilisateur();
        prestataire.setIdUtilisateur(utilisateurId);
        prestataire.setRole(UserRole.PRESTATAIRE);

        Postulation postulation = new Postulation();
        postulation.setCommentaire("Test commentaire");

        when(demandeRepository.findById(demandeId)).thenReturn(Optional.of(demande));
        when(utilisateurRepository.findById(utilisateurId)).thenReturn(Optional.of(prestataire));
        when(postulationRepository.existsByDemandeAndPrestataire(demande, prestataire)).thenReturn(false);
        when(postulationRepository.save(any(Postulation.class))).thenAnswer(i -> i.getArgument(0));
        when(demandeRepository.save(any(Demande.class))).thenAnswer(i -> i.getArgument(0));

        Postulation result = postulationService.postuler(demandeId, utilisateurId, postulation);

        assertNotNull(result);
        assertEquals(demande, result.getDemande());
        assertEquals(prestataire, result.getPrestataire());
        assertTrue(demande.getPostulations().contains(result));

        verify(postulationRepository).save(any(Postulation.class));
        verify(demandeRepository).save(demande);
    }

    @Test
    void testPostuler_demandeNotFound() {
        when(demandeRepository.findById(anyLong())).thenReturn(Optional.empty());
        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                postulationService.postuler(1L, 2L, new Postulation())
        );
        assertEquals("Demande non trouvée.", ex.getMessage());
    }

    @Test
    void testPostuler_utilisateurNotFound() {
        Demande demande = new Demande();
        demande.setIdDemande(1L);
        demande.setUtilisateur(new Utilisateur());
        when(demandeRepository.findById(anyLong())).thenReturn(Optional.of(demande));
        when(utilisateurRepository.findById(anyLong())).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                postulationService.postuler(1L, 2L, new Postulation())
        );
        assertEquals("Utilisateur non trouvé.", ex.getMessage());
    }

    @Test
    void testPostuler_postulerToOwnDemande() {
        Utilisateur utilisateur = new Utilisateur();
        utilisateur.setIdUtilisateur(1L);

        Demande demande = new Demande();
        demande.setIdDemande(1L);
        demande.setUtilisateur(utilisateur);
        demande.setPostulations(new ArrayList<>());

        when(demandeRepository.findById(1L)).thenReturn(Optional.of(demande));
        when(utilisateurRepository.findById(1L)).thenReturn(Optional.of(utilisateur));

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                postulationService.postuler(1L, 1L, new Postulation())
        );
        assertEquals("Vous ne pouvez pas postuler à votre propre demande.", ex.getMessage());
    }

    @Test
    void testPostuler_roleNotAllowed() {
        Utilisateur demandeur = new Utilisateur();
        demandeur.setIdUtilisateur(10L);

        Demande demande = new Demande();
        demande.setIdDemande(1L);
        demande.setUtilisateur(demandeur);
        demande.setPostulations(new ArrayList<>());

        Utilisateur utilisateur = new Utilisateur();
        utilisateur.setIdUtilisateur(2L);
        utilisateur.setRole(UserRole.PARTICULIER); // Role non autorisé

        when(demandeRepository.findById(1L)).thenReturn(Optional.of(demande));
        when(utilisateurRepository.findById(2L)).thenReturn(Optional.of(utilisateur));

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                postulationService.postuler(1L, 2L, new Postulation())
        );
        assertEquals("Seuls les prestataires ou les entreprises peuvent postuler.", ex.getMessage());
    }

    @Test
    void testPostuler_alreadyApplied() {
        Utilisateur demandeur = new Utilisateur();
        demandeur.setIdUtilisateur(10L);

        Demande demande = new Demande();
        demande.setIdDemande(1L);
        demande.setUtilisateur(demandeur);
        demande.setPostulations(new ArrayList<>());

        Utilisateur prestataire = new Utilisateur();
        prestataire.setIdUtilisateur(2L);
        prestataire.setRole(UserRole.PRESTATAIRE);

        when(demandeRepository.findById(1L)).thenReturn(Optional.of(demande));
        when(utilisateurRepository.findById(2L)).thenReturn(Optional.of(prestataire));
        when(postulationRepository.existsByDemandeAndPrestataire(demande, prestataire)).thenReturn(true);

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                postulationService.postuler(1L, 2L, new Postulation())
        );
        assertEquals("Vous avez déjà postulé à cette demande.", ex.getMessage());
    }

    @Test
    void testGetPostulationsByDemande_success() {
        Long demandeId = 1L;
        Demande demande = new Demande();
        demande.setIdDemande(demandeId);

        List<Postulation> postulations = List.of(new Postulation(), new Postulation());

        when(demandeRepository.findById(demandeId)).thenReturn(Optional.of(demande));
        when(postulationRepository.findByDemande(demande)).thenReturn(postulations);

        List<Postulation> result = postulationService.getPostulationsByDemande(demandeId);

        assertEquals(postulations, result);
    }

    @Test
    void testGetPostulationsByDemande_demandeNotFound() {
        when(demandeRepository.findById(anyLong())).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                postulationService.getPostulationsByDemande(1L)
        );
        assertEquals("Demande non trouvée.", ex.getMessage());
    }

    @Test
    void testUpdatePostulation_success() {
        Long id = 1L;
        Postulation existing = new Postulation();
        existing.setCommentaire("Ancien commentaire");
        existing.setDatePostulation(new Date(0));

        Postulation updated = new Postulation();
        updated.setCommentaire("Nouveau commentaire");

        when(postulationRepository.findById(id)).thenReturn(Optional.of(existing));
        when(postulationRepository.save(any(Postulation.class))).thenAnswer(i -> i.getArgument(0));

        Postulation result = postulationService.updatePostulation(id, updated);

        assertEquals("Nouveau commentaire", result.getCommentaire());
        assertNotNull(result.getDatePostulation());
    }

    @Test
    void testUpdatePostulation_notFound() {
        when(postulationRepository.findById(anyLong())).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                postulationService.updatePostulation(1L, new Postulation())
        );
        assertTrue(ex.getMessage().contains("Postulation non trouvée"));
    }

    @Test
    void testDeletePostulation_success() {
        Long postulationId = 1L;

        Utilisateur prestataire = new Utilisateur();
        prestataire.setIdUtilisateur(2L);
        prestataire.setDemandesDejaPostulees(new ArrayList<>());

        Demande demande = new Demande();
        demande.setIdDemande(3L);

        Postulation postulation = new Postulation();
        postulation.setId(postulationId);
        postulation.setPrestataire(prestataire);
        postulation.setDemande(demande);

        when(postulationRepository.findById(postulationId)).thenReturn(Optional.of(postulation));
        when(utilisateurRepository.save(prestataire)).thenReturn(prestataire);

        postulationService.deletePostulation(postulationId);

        // Vérifier que l'idDemande est ajouté à demandesDejaPostulees
        assertTrue(prestataire.getDemandesDejaPostulees().contains(demande.getIdDemande()));

        verify(postulationRepository).delete(postulation);
        verify(utilisateurRepository).save(prestataire);
    }

    @Test
    void testDeletePostulation_postulationNotFound() {
        when(postulationRepository.findById(anyLong())).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                postulationService.deletePostulation(1L)
        );
        assertTrue(ex.getMessage().contains("Postulation non trouvée"));
    }
}
