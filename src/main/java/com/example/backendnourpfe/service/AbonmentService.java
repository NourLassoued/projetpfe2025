package com.example.backendnourpfe.service;

import com.example.backendnourpfe.respository.AbonnementRepository;
import com.example.backendnourpfe.classes.Abonnement;
import com.example.backendnourpfe.classes.StatusAbonnement;
import com.example.backendnourpfe.classes.TypeAbonnement;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
@RequiredArgsConstructor
@Service
public class AbonmentService {
    private final AbonnementRepository abonnementRepository;

    public List<Abonnement> getAbonnementsMensuelEtAnnuelActifs() {
        List<TypeAbonnement> types = Arrays.asList(TypeAbonnement.MENSUEL, TypeAbonnement.ANNUEL);
        return abonnementRepository.findByTypeAbonnementInAndStatusAbonnement(types, StatusAbonnement.ACTIF);
    }



    public List<Abonnement> getAbonnementsExprimer() {
        return abonnementRepository.findByStatusAbonnement(StatusAbonnement.EXPIRE);
    }
}
