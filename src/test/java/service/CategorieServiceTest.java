package service;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import com.example.backendnourpfe.classes.Categorie;
import com.example.backendnourpfe.Respository.CategorieRepository;
import com.example.backendnourpfe.service.CategorieService;
import org.junit.jupiter.api.*;
import org.mockito.*;
import java.util.Optional;

public class CategorieServiceTest {

    @Mock
    private CategorieRepository categorieRepository;

    @InjectMocks
    private CategorieService categorieService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testUpdate_existingCategorie() {
        Long id = 1L;
        Categorie existing = new Categorie();
        existing.setNom("Ancien nom");

        Categorie updated = new Categorie();
        updated.setNom("Nouveau nom");
        updated.setDescription("Desc");

        when(categorieRepository.findById(id)).thenReturn(Optional.of(existing));
        when(categorieRepository.save(any(Categorie.class))).thenAnswer(i -> i.getArgument(0));

        Categorie result = categorieService.update(id, updated);

        assertEquals("Nouveau nom", result.getNom());
        assertEquals("Desc", result.getDescription());
    }

    @Test
    void testUpdate_nonExistingCategorie() {
        Long id = 99L;
        Categorie updated = new Categorie();
        when(categorieRepository.findById(id)).thenReturn(Optional.empty());

        Categorie result = categorieService.update(id, updated);

        assertNull(result);
    }
}
