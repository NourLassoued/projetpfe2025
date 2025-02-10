package com.example.backendnourpfe.interfacee;


import com.example.backendnourpfe.classes.Avis;
import com.example.backendnourpfe.classes.Demande;
import com.example.backendnourpfe.classes.Reservation;
import com.example.backendnourpfe.classes.Utilisateur;

import java.util.List;

public interface UtlisateurInterface {
    public Utilisateur ajouterUtilisateur(Utilisateur utilisateur);
    void deleteUser(Long id);
    public Demande creerDemande(Long idUtilisateur, Long idservice,Demande demande);
    public Avis donnerAvis(Long idUtilisateur, Long idAvisUtilisateur, Avis avis);
    public List<Object> getAvisByAvisUtilisateur(Long idAvisUtilisateur);
    public Reservation creerReservation(Long idParticulier, Long idPrestataire, Reservation reservation);

}
