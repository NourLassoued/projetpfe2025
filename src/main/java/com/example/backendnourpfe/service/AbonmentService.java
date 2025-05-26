package com.example.backendnourpfe.service;

import com.example.backendnourpfe.Respository.AbonnementRepository;
import com.example.backendnourpfe.Respository.UtilisateurRepository;
import com.example.backendnourpfe.classes.Abonnement;
import com.example.backendnourpfe.classes.StatusAbonnement;
import com.example.backendnourpfe.classes.TypeAbonnement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class AbonmentService {
    @Autowired
    private AbonnementRepository abonnementRepository;
    public List<Abonnement> getAbonnementsMensuelEtAnnuelActifs() {
        List<TypeAbonnement> types = Arrays.asList(TypeAbonnement.MENSUEL, TypeAbonnement.ANNUEL);
        return abonnementRepository.findByTypeAbonnementInAndStatusAbonnement(types, StatusAbonnement.ACTIF);
    }

    public List<Abonnement> getAbonnementsParType(TypeAbonnement type) {
        return abonnementRepository.findByTypeAbonnement(type);
    }

    public List<Abonnement> getAbonnementsExprimer() {
        return abonnementRepository.findByStatusAbonnement(StatusAbonnement.EXPIRE);
    }
}
