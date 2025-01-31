package com.example.backendnourpfe.service;



import com.example.backendnourpfe.Respository.EntrepriseRepository;
import com.example.backendnourpfe.classes.Entreprise;
import com.example.backendnourpfe.interfacee.EntrepriseInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EntrepriseService  implements EntrepriseInterface {
    @Autowired
    private EntrepriseRepository entrepriseRepository;


    public Entreprise ajouterEntreprise(Entreprise entreprise) {
        return entrepriseRepository.save(entreprise);
    }
}


