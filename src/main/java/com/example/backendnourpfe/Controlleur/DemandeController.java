package com.example.backendnourpfe.Controlleur;

import com.example.backendnourpfe.classes.Demande;
import com.example.backendnourpfe.service.DemandeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

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


    @PutMapping( "/{id}")
    public Demande updateDemande(@PathVariable Long id, @RequestBody Demande demandeDetails) {
        return demandeService.updateDemande(id, demandeDetails);
    }
    @GetMapping("/{id}")
    public ResponseEntity<Demande> getDemandeById(@PathVariable Long id) {
        Optional<Demande> demande = demandeService.getDemandeById(id);
        return demande.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }


    @GetMapping("/getAllDemandesByUtilisateurId/{idUtilisateur}")
    public List<Demande> getAllDemandesByUtilisateurId(@PathVariable Long idUtilisateur) {
        return demandeService.getAllDemandesByUtilisateurId(idUtilisateur);
    }
}


