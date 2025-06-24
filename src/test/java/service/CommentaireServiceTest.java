package service;

import com.example.backendnourpfe.respository.CommentaireRepository;
import com.example.backendnourpfe.respository.PublicationRepository;
import com.example.backendnourpfe.respository.UtilisateurRepository;
import com.example.backendnourpfe.classes.Commentaire;
import com.example.backendnourpfe.classes.Publication;
import com.example.backendnourpfe.classes.Utilisateur;
import com.example.backendnourpfe.service.CommentaireService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import org.mockito.MockitoAnnotations;

public class CommentaireServiceTest {

    @Mock
    private CommentaireRepository commentaireRepository;

    @Mock
    private PublicationRepository publicationRepository;

    @Mock
    private UtilisateurRepository utilisateurRepository;

    @InjectMocks
    private CommentaireService commentaireService;

    private Commentaire commentaire;
    private Publication publication;
    private Utilisateur utilisateur;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);

        publication = new Publication();
        publication.setId(1L);

        utilisateur = new Utilisateur();
        utilisateur.setIdUtilisateur(2L);

        commentaire = new Commentaire();
        commentaire.setContenu("Test commentaire");
    }

    @Test
    public void testAjouterCommentaire_Success() {
        when(publicationRepository.findById(1L)).thenReturn(Optional.of(publication));
        when(utilisateurRepository.findById(2L)).thenReturn(Optional.of(utilisateur));
        when(commentaireRepository.save(any(Commentaire.class))).thenReturn(commentaire);

        Commentaire result = commentaireService.ajouterCommentaire(1L, 2L, commentaire);

        assertNotNull(result);
        assertEquals("Test commentaire", result.getContenu());
        verify(commentaireRepository, times(1)).save(commentaire);
    }

    @Test
    public void testAjouterCommentaire_PublicationOuUtilisateurNonTrouve() {
        when(publicationRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () ->
                commentaireService.ajouterCommentaire(1L, 2L, commentaire)
        );

        assertEquals("Publication ou Utilisateur introuvable.", exception.getMessage());
    }

    @Test
    public void testGetCommentairesParPublication() {
        when(commentaireRepository.findByPublicationId(1L))
                .thenReturn(Arrays.asList(commentaire));

        List<Commentaire> result = commentaireService.getCommentairesParPublication(1L);

        assertEquals(1, result.size());
        assertEquals("Test commentaire", result.get(0).getContenu());
    }

    @Test
    public void testGetCommentairesParUtilisateur() {
        when(commentaireRepository.findByParticulier_IdUtilisateur(2L))
                .thenReturn(Arrays.asList(commentaire));

        List<Commentaire> result = commentaireService.getCommentairesParUtilisateur(2L);

        assertEquals(1, result.size());
        assertEquals("Test commentaire", result.get(0).getContenu());
    }

    @Test
    public void testSupprimerCommentaire() {
        Long idCommentaire = 1L;
        commentaireService.supprimerCommentaire(idCommentaire);
        verify(commentaireRepository, times(1)).deleteById(idCommentaire);
    }
}