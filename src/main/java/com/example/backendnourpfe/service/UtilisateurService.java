package com.example.backendnourpfe.service;


import com.example.backendnourpfe.Respository.UtilisateurRepository;
import com.example.backendnourpfe.classes.Utilisateur;
import com.example.backendnourpfe.interfacee.UtlisateurInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service

public class UtilisateurService implements UtlisateurInterface {
    @Autowired
    private UtilisateurRepository utilisateurRepository;
    @Override

    public Utilisateur ajouterUtilisateur(Utilisateur utilisateur) {
        return utilisateurRepository.save(utilisateur);
    }
}
