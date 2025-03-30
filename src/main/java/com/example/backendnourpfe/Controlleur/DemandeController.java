package com.example.backendnourpfe.Controlleur;

import com.example.backendnourpfe.classes.Demande;
import com.example.backendnourpfe.classes.Utilisateur;
import com.example.backendnourpfe.service.DemandeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
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

    @PutMapping("updateDemande/{id}")
    public ResponseEntity<Demande> updateDemande(
            @PathVariable Long id,

            @RequestBody Demande demandeDetails) {



        try {
            Demande updatedDemande = demandeService.updateDemande(id, demandeDetails);
            return ResponseEntity.ok(updatedDemande);
        } catch (Exception e) {
            System.out.println("Erreur : " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);  // Return a bad request status
        }
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

@GetMapping("/utilisateur/{id}")
public ResponseEntity<List<Demande>> getDemandesDisponibles(@PathVariable Long id) {
    try {
        List<Demande> demandesDisponibles = demandeService.getAvailableDemandesForUtilisateur(id);


        if (demandesDisponibles.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        return new ResponseEntity<>(demandesDisponibles, HttpStatus.OK);

    } catch (RuntimeException e) {

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}



}


