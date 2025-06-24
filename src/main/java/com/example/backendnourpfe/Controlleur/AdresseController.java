package com.example.backendnourpfe.Controlleur;

import com.example.backendnourpfe.classes.Adresse;
import com.example.backendnourpfe.service.AdresseService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/adresses")
@CrossOrigin("*")
public class AdresseController {

    private final AdresseService adresseService;

    public AdresseController(AdresseService adresseService) {
        this.adresseService = adresseService;
    }

    @PostMapping
    public Adresse ajouterAdresse(@RequestBody Adresse adresse) {
        return adresseService.ajouterAdresse(adresse);
    }


    @GetMapping
    public List<Adresse> getAllAdresses() {
        return adresseService.getAllAdresses();
    }


    @GetMapping("/{id}")
    public Optional<Adresse> getAdresseById(@PathVariable Long id) {
        return adresseService.getAdresseById(id);
    }


    @PutMapping("/{id}")
    public Adresse modifierAdresse(@PathVariable Long id, @RequestBody Adresse nouvelleAdresse) {
        return adresseService.modifierAdresse(id, nouvelleAdresse);
    }


    @DeleteMapping("/{id}")
    public void supprimerAdresse(@PathVariable Long id) {
        adresseService.supprimerAdresse(id);
    }
}