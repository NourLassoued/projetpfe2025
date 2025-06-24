package com.example.backendnourpfe.service;

import com.example.backendnourpfe.respository.CategorieRepository;
import com.example.backendnourpfe.respository.ServiceRepository;
import com.example.backendnourpfe.respository.UtilisateurRepository;
import com.example.backendnourpfe.classes.*;
import com.example.backendnourpfe.interfacee.Serviceinterface;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ServiService implements Serviceinterface {
    private final ServiceRepository serviceRepository;
    private final CategorieRepository categorieRepository;
    private final UtilisateurRepository utilisateurRepository;

    @Override
    public List<Servicee> getAllServices() {
        return serviceRepository.findAll();
    }

    @Override
    public Servicee createService(Servicee service) {
        return serviceRepository.save(service);
    }

    @Override
    public Servicee updateService(Long id, Servicee service) {
        service.setIdservice(id);
        return serviceRepository.save(service);
    }

    @Override
    public void deleteService(Long id) {
        serviceRepository.deleteById(id);
    }

    public Servicee ajouterServiceAuCategorie(Long categorieId, Servicee service) {
        Categorie categorie = categorieRepository.findById(categorieId).orElseThrow(() -> new RuntimeException("Catégorie non trouvée"));
        service.setCategorie(categorie);
        return serviceRepository.save(service);
    }

    public List<Servicee> getAllServicesByCategorie(Long categorieId) {
        return serviceRepository.findByCategorieId(categorieId);
    }
    public List<Utilisateur> getUtilisateursByService(Long serviceId) {
        return utilisateurRepository.findUtilisateursByService(serviceId);
    }
    public List<Utilisateur> getUtilisateursByServiceOrderedByRating(Long serviceId) {
        return utilisateurRepository.findUtilisateursByServiceOrderedByRating(serviceId);
    }
    public List<Servicee> rechercherParNom(String nom) {
        return serviceRepository.findByNomserviceContainingIgnoreCase(nom);
    }
    public Servicee findById(Long id) {
        Optional<Servicee> serviceOptional = serviceRepository.findById(id);
        return serviceOptional.orElse(null);
    }
}

