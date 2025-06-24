package com.example.backendnourpfe.respository;

import com.example.backendnourpfe.classes.Servicee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceRepository extends JpaRepository<Servicee, Long> {
    List<Servicee> findByCategorieId(Long categorieId);
    List<Servicee> findByNomserviceIn(List<String> nomservices);
    List<Servicee> findByNomserviceContainingIgnoreCase(String nomservice);





}
