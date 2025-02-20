package com.example.backendnourpfe.Controlleur;

import com.example.backendnourpfe.classes.Demande;
import com.example.backendnourpfe.service.DemandeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/demandes")
public class DemandeController {
@Autowired
    private DemandeService demandeService;
    @DeleteMapping("deleteDemande/{idDemande}")
    public void deleteDemande(@PathVariable Long idDemande) {
        demandeService.deleteDemande(idDemande);
    }


    @PutMapping("updateDemande/{idDemande}")
    public Demande updateDemande(@PathVariable Long idDemande, @RequestBody Demande demandeDetails) {
        return demandeService.updateDemande(idDemande, demandeDetails);
    }


    @GetMapping("/getAllDemandesByUtilisateurId/{idUtilisateur}")
    public List<Demande> getAllDemandesByUtilisateurId(@PathVariable Long idUtilisateur) {
        return demandeService.getAllDemandesByUtilisateurId(idUtilisateur);
    }
}


