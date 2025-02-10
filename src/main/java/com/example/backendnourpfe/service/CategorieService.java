package com.example.backendnourpfe.service;

import com.example.backendnourpfe.Respository.CategorieRepository;
import com.example.backendnourpfe.classes.Categorie;
import com.example.backendnourpfe.interfacee.CategoriesInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategorieService implements CategoriesInterface {
@Autowired
    private CategorieRepository categorieRepository;

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

    @Override
    public void deleteCategorie(Long id) {
        categorieRepository.deleteById(id);
    }
}
