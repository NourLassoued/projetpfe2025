package com.example.backendnourpfe.service;

import com.example.backendnourpfe.Respository.CategorieRepository;
import com.example.backendnourpfe.Respository.ServiceRepository;
import com.example.backendnourpfe.classes.Categorie;
import com.example.backendnourpfe.classes.Servicee;
import com.example.backendnourpfe.interfacee.Serviceinterface;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ServiService implements Serviceinterface {
    @Autowired
    private  ServiceRepository serviceRepository;
    @Autowired
    private CategorieRepository categorieRepository;

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
}