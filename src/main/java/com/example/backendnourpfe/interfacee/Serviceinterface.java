package com.example.backendnourpfe.interfacee;

import com.example.backendnourpfe.classes.Servicee;
import com.example.backendnourpfe.classes.Utilisateur;

import java.util.List;

public interface Serviceinterface {
     List<Servicee> getAllServices() ;
     Servicee createService(Servicee service) ;
     Servicee updateService(Long id, Servicee service) ;
     void deleteService(Long id);
     Servicee ajouterServiceAuCategorie(Long categorieId, Servicee service);
     List<Servicee> getAllServicesByCategorie(Long categorieId);
     List<Utilisateur> getUtilisateursByService(Long serviceId);
     List<Servicee> rechercherParNom(String nom);
}