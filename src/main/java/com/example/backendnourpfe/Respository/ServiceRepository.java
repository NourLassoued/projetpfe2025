package com.example.backendnourpfe.Respository;

import com.example.backendnourpfe.classes.Servicee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceRepository extends JpaRepository<Servicee, Long> {
    List<Servicee> findByCategorieId(Long categorieId);




}
