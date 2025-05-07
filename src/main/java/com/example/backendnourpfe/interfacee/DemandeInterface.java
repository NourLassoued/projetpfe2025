package com.example.backendnourpfe.interfacee;

import com.example.backendnourpfe.classes.Adresse;
import com.example.backendnourpfe.classes.Demande;
import com.example.backendnourpfe.classes.Servicee;

import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface DemandeInterface {
    public void deleteDemande(Long idDemande);
    public Demande updateDemande(Long id,  Demande demandeDetails);
    public List<Demande> getAllDemandesByUtilisateurId(Long idUtilisateur);
    public Optional<Demande> getDemandeById(Long id);
    public List<Demande> getAvailableDemandesForUtilisateur(Long utilisateurId);
    public List<Demande> getAllDemandesByUtilisateurIddDateBefore(Long idUtilisateur);
    public List<Demande> getAllDemandesByUtilisateurIdTerminees(Long idUtilisateur);

}
