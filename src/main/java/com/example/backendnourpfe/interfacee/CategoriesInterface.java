package com.example.backendnourpfe.interfacee;

import com.example.backendnourpfe.classes.Categorie;

import java.util.List;

public interface CategoriesInterface {
     List<Categorie> getAll() ;

     List<Categorie> searchCategoriesByName(String nom);
     Categorie create(Categorie categorie) ;

     Categorie update(Long id, Categorie categorie) ;


     void deleteCategorie( Long id) ;


}
