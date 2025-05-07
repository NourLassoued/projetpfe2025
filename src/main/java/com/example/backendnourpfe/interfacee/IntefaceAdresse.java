package com.example.backendnourpfe.interfacee;

import com.example.backendnourpfe.classes.Adresse;
import com.example.backendnourpfe.classes.Utilisateur;

import java.util.List;
import java.util.Optional;

public interface IntefaceAdresse {
    public Adresse ajouterAdresse(Adresse adresse);
    public List<Adresse> getAllAdresses();
    public Optional<Adresse> getAdresseById(Long id);
    public Adresse modifierAdresse(Long id, Adresse nouvelleAdresse);
    public void supprimerAdresse(Long id);

}
