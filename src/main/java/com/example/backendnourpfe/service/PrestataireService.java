package com.example.backendnourpfe.service;


import com.example.backendnourpfe.Respository.PrestataireRepository;
import com.example.backendnourpfe.classes.Prestataire;
import com.example.backendnourpfe.interfacee.PrestataireInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PrestataireService implements PrestataireInterface {
    @Autowired
    private PrestataireRepository prestataireRepository;

    public Prestataire ajouterPrestataire(Prestataire prestataire) {
        // Assurez-vous que les valeurs de prestataire sont validées ici si nécessaire
        return prestataireRepository.save(prestataire);
    }
}

