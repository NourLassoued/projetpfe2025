package com.example.backendnourpfe.service;

import com.example.backendnourpfe.Respository.AdresseRepository;
import com.example.backendnourpfe.classes.Adresse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdresseService {
    @Autowired
    private AdresseRepository adresseRepository;


    public Adresse ajouterAdresse(Adresse adresse) {
        return adresseRepository.save(adresse);
    }


    public List<Adresse> getAllAdresses() {
        return adresseRepository.findAll();
    }


    public Optional<Adresse> getAdresseById(Long id) {
        return adresseRepository.findById(id);
    }


    public Adresse modifierAdresse(Long id, Adresse nouvelleAdresse) {
        return adresseRepository.findById(id).map(adresse -> {
            adresse.setGovernoate(nouvelleAdresse.getGovernoate());
            adresse.setVille(nouvelleAdresse.getVille());
           ;
            return adresseRepository.save(adresse);
        }).orElseThrow(() -> new RuntimeException("Adresse non trouvée"));
    }


    public void supprimerAdresse(Long id) {
        adresseRepository.deleteById(id);
    }

}
