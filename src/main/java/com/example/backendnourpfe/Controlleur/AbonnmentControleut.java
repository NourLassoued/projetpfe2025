package com.example.backendnourpfe.Controlleur;

import com.example.backendnourpfe.Respository.AbonnementRepository;
import com.example.backendnourpfe.classes.Abonnement;
import com.example.backendnourpfe.classes.StatusAbonnement;
import com.example.backendnourpfe.service.AbonmentService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
@RestController
@RequestMapping("/AbonmentS")
@CrossOrigin("*")
public class AbonnmentControleut {
    private final AbonmentService abonnementService;
    private final AbonnementRepository abonnementRepository;

    public AbonnmentControleut(AbonmentService abonnementService, AbonnementRepository abonnementRepository) {
        this.abonnementService = abonnementService;
        this.abonnementRepository = abonnementRepository;
    }

    @GetMapping("/actifs/mensuel-annuel")
    public List<Abonnement> getMensuelEtAnnuelActifs() {
        return abonnementService.getAbonnementsMensuelEtAnnuelActifs();
    }
    @GetMapping("/actifs")
    public List<Abonnement> getAbonnementsActifs() {
        return abonnementRepository.findByStatusAbonnement(StatusAbonnement.ACTIF);
    }
    @GetMapping("/Exprimer")
    public List<Abonnement> getAbonnementsExprimer() {
        return abonnementService.getAbonnementsExprimer();
    }
}
