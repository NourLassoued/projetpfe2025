package com.example.backendnourpfe.interfacee;

import com.example.backendnourpfe.classes.Demande;

import java.util.List;
import java.util.Optional;

public interface DemandeInterface {
     void deleteDemande(Long idDemande);
     Demande updateDemande(Long id,  Demande demandeDetails);
     List<Demande> getAllDemandesByUtilisateurId(Long idUtilisateur);
     Optional<Demande> getDemandeById(Long id);
     List<Demande> getAvailableDemandesForUtilisateur(Long utilisateurId);
     List<Demande> getAllDemandesByUtilisateurIddDateBefore(Long idUtilisateur);
     List<Demande> getAllDemandesByUtilisateurIdTerminees(Long idUtilisateur);

}
