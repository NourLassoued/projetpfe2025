package service;

import com.example.backendnourpfe.respository.AdresseRepository;
import com.example.backendnourpfe.classes.Adresse;
import com.example.backendnourpfe.service.AdresseService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

class AdresseServiceTest {

    @Mock
    private AdresseRepository adresseRepository;

    @InjectMocks
    private AdresseService adresseService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testAjouterAdresse() {
        Adresse adresse = new Adresse();
        adresse.setGovernoate("Tunis");
        adresse.setVille("Tunis");

        when(adresseRepository.save(adresse)).thenReturn(adresse);

        Adresse result = adresseService.ajouterAdresse(adresse);
        assertEquals("Tunis", result.getGovernoate());
        verify(adresseRepository, times(1)).save(adresse);
    }

    @Test
    void testGetAllAdresses() {
        Adresse a1 = new Adresse();
        Adresse a2 = new Adresse();

        when(adresseRepository.findAll()).thenReturn(Arrays.asList(a1, a2));

        List<Adresse> result = adresseService.getAllAdresses();
        assertEquals(2, result.size());
        verify(adresseRepository, times(1)).findAll();
    }

    @Test
    void testGetAdresseById_Found() {
        Adresse adresse = new Adresse();
        adresse.setGovernoate("Sfax");
        when(adresseRepository.findById(1L)).thenReturn(Optional.of(adresse));

        Optional<Adresse> result = adresseService.getAdresseById(1L);
        assertTrue(result.isPresent());
        assertEquals("Sfax", result.get().getGovernoate());
        verify(adresseRepository, times(1)).findById(1L);
    }

    @Test
    void testModifierAdresse_Found() {
        Adresse existing = new Adresse();
        existing.setGovernoate("Tunis");
        existing.setVille("Tunis");

        Adresse updated = new Adresse();
        updated.setGovernoate("Sousse");
        updated.setVille("Sousse");

        when(adresseRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(adresseRepository.save(any(Adresse.class))).thenAnswer(i -> i.getArguments()[0]);

        Adresse result = adresseService.modifierAdresse(1L, updated);
        assertEquals("Sousse", result.getGovernoate());
        assertEquals("Sousse", result.getVille());
        verify(adresseRepository, times(1)).findById(1L);
        verify(adresseRepository, times(1)).save(existing);
    }

    @Test
    void testModifierAdresse_NotFound() {
        when(adresseRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            adresseService.modifierAdresse(1L, new Adresse());
        });

        assertEquals("Adresse non trouvée", exception.getMessage());
        verify(adresseRepository, times(1)).findById(1L);
        verify(adresseRepository, never()).save(any());
    }

    @Test
    void testSupprimerAdresse() {
        doNothing().when(adresseRepository).deleteById(1L);

        adresseService.supprimerAdresse(1L);

        verify(adresseRepository, times(1)).deleteById(1L);
    }
}