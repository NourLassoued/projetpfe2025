package com.example.backendnourpfe.interfacee;


import com.example.backendnourpfe.classes.*;

import javax.management.ServiceNotFoundException;
import java.util.List;
import java.util.Map;

public interface UtlisateurInterface {
    public Utilisateur ajouterUtilisateur(Utilisateur utilisateur);
    void deleteUser(Long id);
    public Utilisateur updateProfil(Long idUtilisateur, Utilisateur utilisateurDetails) ;
    public Avis donnerAvis(Long idUtilisateur, Long idAvisUtilisateur, Avis avis);
    public List<Object> getAvisByAvisUtilisateur(Long idAvisUtilisateur);
    public Reservation creerReservation(Long idParticulier, Long idPrestataire, Reservation reservation);

    public Map<String, Object> creerDemande(Long idUtilisateur, Long idservice, Demande demande);
}
