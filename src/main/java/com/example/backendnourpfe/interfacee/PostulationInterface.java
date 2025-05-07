package com.example.backendnourpfe.interfacee;

import com.example.backendnourpfe.classes.Postulation;
import com.example.backendnourpfe.classes.Reservation;
import com.example.backendnourpfe.classes.Utilisateur;

import java.util.List;

public interface PostulationInterface {
    public Postulation postuler(Long demandeId, Long utilisateurId, Postulation postulation);
    public List<Postulation> getPostulationsByDemande(Long demandeId);
    public Postulation updatePostulation(Long id, Postulation updatedPostulation);
    public void deletePostulation(Long id);
    public List<Reservation> getReservationsByPrestataireAndStatus(Utilisateur prestataire);

}
