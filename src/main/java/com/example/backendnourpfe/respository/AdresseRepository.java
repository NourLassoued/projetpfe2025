package com.example.backendnourpfe.respository;

import com.example.backendnourpfe.classes.Adresse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdresseRepository extends JpaRepository<Adresse, Long> {

}
