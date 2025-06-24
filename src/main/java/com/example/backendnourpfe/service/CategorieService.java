package com.example.backendnourpfe.service;

import com.example.backendnourpfe.respository.CategorieRepository;
import com.example.backendnourpfe.classes.Categorie;
import com.example.backendnourpfe.interfacee.CategoriesInterface;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
@RequiredArgsConstructor
@Service
public class CategorieService implements CategoriesInterface {
    private final CategorieRepository categorieRepository;

    @Override
    public List<Categorie> getAll() {
        return categorieRepository.findAll();
    }

    @Override
    public Categorie create(Categorie categorie) {
        return categorieRepository.save(categorie);
    }

    @Override
    public Categorie update(Long id, Categorie categorie) {
        Optional<Categorie> existingCategorie = categorieRepository.findById(id);
        if (existingCategorie.isPresent()) {
            Categorie updatedCategorie = existingCategorie.get();
            updatedCategorie.setNom(categorie.getNom());
            updatedCategorie.setDescription(categorie.getDescription());
            updatedCategorie.setImageCategorie(categorie.getImageCategorie());
            updatedCategorie.setTarif(categorie.getTarif());
            return categorieRepository.save(updatedCategorie);
        }
        return null;
    }
    public Categorie findById(Long id) {
        Optional<Categorie> categorieOptional = categorieRepository.findById(id);
        return categorieOptional.orElse(null);
    }
    public List<Categorie> searchCategoriesByName(String nom) {
        if (nom == null || nom.isEmpty()) {
            return categorieRepository.findAll();
        } else {
            return categorieRepository.findByNomContainingIgnoreCase(nom);
        }
    }

    @Override
    public void deleteCategorie(Long id) {
        categorieRepository.deleteById(id);
    }
}
