package com.example.backendnourpfe.Respository;


import com.example.backendnourpfe.classes.Prestataire;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PrestataireRepository extends JpaRepository<Prestataire, Long> {

}

