package service;



import com.example.backendnourpfe.respository.CategorieRepository;
import com.example.backendnourpfe.respository.ServiceRepository;
import com.example.backendnourpfe.respository.UtilisateurRepository;
import com.example.backendnourpfe.classes.*;
import com.example.backendnourpfe.service.ServiService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ServiServiceTest {

    @InjectMocks
    private ServiService serviService;

    @Mock
    private ServiceRepository serviceRepository;

    @Mock
    private CategorieRepository categorieRepository;

    @Mock
    private UtilisateurRepository utilisateurRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateService() {
        Servicee service = new Servicee();
        service.setNomservice("Plomberie");

        when(serviceRepository.save(service)).thenReturn(service);

        Servicee saved = serviService.createService(service);

        assertNotNull(saved);
        assertEquals("Plomberie", saved.getNomservice());
        verify(serviceRepository, times(1)).save(service);
    }

    @Test
    void testUpdateService() {
        Servicee service = new Servicee();
        service.setNomservice("Ancien Nom");

        Servicee updated = new Servicee();
        updated.setNomservice("Nouveau Nom");

        when(serviceRepository.save(any(Servicee.class))).thenReturn(updated);

        Servicee result = serviService.updateService(1L, updated);

        assertEquals("Nouveau Nom", result.getNomservice());
        assertEquals(1L, result.getIdservice());
    }

    @Test
    void testDeleteService() {
        serviService.deleteService(10L);
        verify(serviceRepository, times(1)).deleteById(10L);
    }

    @Test
    void testAjouterServiceAuCategorie_Success() {
        Long categorieId = 1L;
        Categorie categorie = new Categorie();
        categorie.setId(categorieId); // corriger le nom du setter si besoin
        categorie.setNom("Maison");   // c'est ce qui manquait !

        Servicee service = new Servicee();
        service.setNomservice("Plomberie");

        when(categorieRepository.findById(categorieId)).thenReturn(Optional.of(categorie));
        when(serviceRepository.save(any(Servicee.class))).thenAnswer(i -> i.getArgument(0));

        Servicee result = serviService.ajouterServiceAuCategorie(categorieId, service);

        assertNotNull(result);
        assertNotNull(result.getCategorie());
        assertEquals("Maison", result.getCategorie().getNom());
    }


    @Test
    void testAjouterServiceAuCategorie_CategorieNonTrouvee() {
        when(categorieRepository.findById(999L)).thenReturn(Optional.empty());

        Servicee service = new Servicee();

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                serviService.ajouterServiceAuCategorie(999L, service)
        );

        assertEquals("Catégorie non trouvée", ex.getMessage());
    }

    @Test
    void testGetAllServicesByCategorie() {
        Long catId = 2L;
        List<Servicee> services = Arrays.asList(new Servicee(), new Servicee());

        when(serviceRepository.findByCategorieId(catId)).thenReturn(services);

        List<Servicee> result = serviService.getAllServicesByCategorie(catId);

        assertEquals(2, result.size());
    }

    @Test
    void testGetUtilisateursByService() {
        Long serviceId = 3L;
        List<Utilisateur> utilisateurs = Arrays.asList(new Utilisateur(), new Utilisateur());

        when(utilisateurRepository.findUtilisateursByService(serviceId)).thenReturn(utilisateurs);

        List<Utilisateur> result = serviService.getUtilisateursByService(serviceId);

        assertEquals(2, result.size());
    }

    @Test
    void testGetUtilisateursByServiceOrderedByRating() {
        Long serviceId = 3L;
        List<Utilisateur> utilisateurs = Arrays.asList(new Utilisateur(), new Utilisateur());

        when(utilisateurRepository.findUtilisateursByServiceOrderedByRating(serviceId)).thenReturn(utilisateurs);

        List<Utilisateur> result = serviService.getUtilisateursByServiceOrderedByRating(serviceId);

        assertEquals(2, result.size());
    }

    @Test
    void testRechercherParNom() {
        String motCle = "Plomb";
        List<Servicee> results = Arrays.asList(new Servicee(), new Servicee());

        when(serviceRepository.findByNomserviceContainingIgnoreCase(motCle)).thenReturn(results);

        List<Servicee> found = serviService.rechercherParNom(motCle);

        assertEquals(2, found.size());
    }

    @Test
    void testFindById_Trouve() {
        Servicee service = new Servicee();
        service.setIdservice(100L);

        when(serviceRepository.findById(100L)).thenReturn(Optional.of(service));

        Servicee found = serviService.findById(100L);

        assertNotNull(found);
        assertEquals(100L, found.getIdservice());
    }

    @Test
    void testFindById_NonTrouve() {
        when(serviceRepository.findById(404L)).thenReturn(Optional.empty());

        Servicee found = serviService.findById(404L);

        assertNull(found);
    }
}
