package com.example.backendnourpfe.Respository;

import com.example.backendnourpfe.classes.Categorie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategorieRepository extends JpaRepository<Categorie, Long> {
    List<Categorie> findByNomContainingIgnoreCase(String nom);
    Optional<Categorie> findByNom(String nom);



}
