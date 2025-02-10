package com.example.backendnourpfe.Respository;

import com.example.backendnourpfe.classes.Servicee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ServiceRepository extends JpaRepository<Servicee, Long> {




}
