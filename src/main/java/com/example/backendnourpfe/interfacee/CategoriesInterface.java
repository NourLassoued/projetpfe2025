package com.example.backendnourpfe.interfacee;

import com.example.backendnourpfe.classes.Categorie;

import java.util.List;

public interface CategoriesInterface {
    public List<Categorie> getAll() ;

    public List<Categorie> searchCategoriesByName(String nom);
    public Categorie create(Categorie categorie) ;

    public Categorie update(Long id, Categorie categorie) ;


    public void deleteCategorie( Long id) ;


}
