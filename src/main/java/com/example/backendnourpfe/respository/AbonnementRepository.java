package com.example.backendnourpfe.respository;

import com.example.backendnourpfe.classes.Abonnement;

import com.example.backendnourpfe.classes.StatusAbonnement;
import com.example.backendnourpfe.classes.TypeAbonnement;
import com.example.backendnourpfe.classes.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface AbonnementRepository extends JpaRepository<Abonnement, Long> {
    boolean existsByUtilisateurAndTypeAbonnement(Utilisateur utilisateur, TypeAbonnement typeAbonnement);



    List<Abonnement> findByStatusAbonnement(StatusAbonnement statusAbonnement);


    List<Abonnement> findByTypeAbonnementInAndStatusAbonnement(List<TypeAbonnement> types, StatusAbonnement status);
}