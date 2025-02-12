package com.example.backendnourpfe.interfacee;

import com.example.backendnourpfe.classes.Servicee;
import com.example.backendnourpfe.classes.Utilisateur;
import org.springframework.stereotype.Service;

import java.util.List;

public interface Serviceinterface {
    public List<Servicee> getAllServices() ;
    public Servicee createService(Servicee service) ;
    public Servicee updateService(Long id, Servicee service) ;
    public void deleteService(Long id);
    public Servicee ajouterServiceAuCategorie(Long categorieId, Servicee service);
    public List<Servicee> getAllServicesByCategorie(Long categorieId);
    public List<Utilisateur> getUtilisateursByService(Long serviceId);
    }