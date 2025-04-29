package com.example.backendnourpfe.Respository;



import com.example.backendnourpfe.classes.Servicee;
import com.example.backendnourpfe.classes.UserRole;
import com.example.backendnourpfe.classes.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {
    Optional<Utilisateur> findByEmail(String email);
    boolean existsByEmail(String email);
    @Query("SELECT u FROM Utilisateur u WHERE u.role = :role")
    List<Utilisateur> findByRole(@Param("role") UserRole role);


    @Transactional
    @Modifying
    @Query("update Utilisateur  u set u.password= ?2 where u.email= ?1")
    void updatePassword(String email, String password);

    @Query("SELECT u FROM Utilisateur u JOIN u.servicesOfferts s WHERE s.idservice = :serviceId")
    List<Utilisateur> findUtilisateursByService(@Param("serviceId") Long serviceId);
    @Query("SELECT u FROM Utilisateur u " +
            "JOIN u.servicesOfferts s " +
            "LEFT JOIN u.avisRecus a " +
            "WHERE s.idservice = :serviceId " +
            "GROUP BY u " +
            "ORDER BY COALESCE(AVG(a.note), 0) DESC")
    List<Utilisateur> findUtilisateursByServiceOrderedByRating(@Param("serviceId") Long serviceId);

/*
    @Query("SELECT u FROM Utilisateur u LEFT JOIN FETCH u.adressee WHERE u.role = :role")
    List<Utilisateur> findAllPrestatairesWithAdresse(@Param("role") UserRole role);
*/
@Query("SELECT u FROM Utilisateur u LEFT JOIN FETCH u.adressee LEFT JOIN FETCH u.disponibilites WHERE u.role = :role")
List<Utilisateur> findAllPrestatairesWithAdresse(@Param("role") UserRole role);

}


