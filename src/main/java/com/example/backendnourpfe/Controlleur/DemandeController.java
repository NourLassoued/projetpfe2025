package com.example.backendnourpfe.Controlleur;

import com.example.backendnourpfe.Respository.PostulationRepository;
import com.example.backendnourpfe.classes.Demande;
import com.example.backendnourpfe.classes.Postulation;

import com.example.backendnourpfe.service.DemandeService;
import com.example.backendnourpfe.service.PostulationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;


import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/demandes")
public class DemandeController {
@Autowired
    private DemandeService demandeService;
    @Autowired
    private PostulationRepository postulationRepository;
    @Autowired
    private PostulationService postulationService;
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
    @GetMapping("/{id}/demandestermines")
    public ResponseEntity<List<Demande>> getDemandesTerminees(@PathVariable Long id) {
        List<Demande> demandesTerminees = demandeService.getAllDemandesByUtilisateurIdTerminees(id);
        return ResponseEntity.ok(demandesTerminees);
    }

    @GetMapping("/{id}/datebefore")
    public ResponseEntity<List<Demande>> getDemandesByUtilisateurDateBefore(@PathVariable Long id) {
        List<Demande> demandes = demandeService.getAllDemandesByUtilisateurIddDateBefore(id);
        return ResponseEntity.ok(demandes);
    }
    @GetMapping("/{idDemande}/postulations")
    public ResponseEntity<List<Postulation>> getPostulationsByDemande(@PathVariable Long idDemande) {
        List<Postulation> postulations = postulationRepository.findByDemande_IdDemande(idDemande);
        return ResponseEntity.ok(postulations);
    }
    @GetMapping("/{id}/postulationsutlisateure")
    public ResponseEntity<List<Postulation>> getPostulationsByPrestataire(@PathVariable Long id) {
        List<Postulation> postulations = postulationService.getPostulationsByPrestataire(id);
        return ResponseEntity.ok(postulations);
    }
    @PutMapping("/updatePostulation/{id}")
    public ResponseEntity<Postulation> updatePostulation(
            @PathVariable Long id,
            @RequestBody Postulation updatedPostulation) {

        try {
            Postulation postulation = postulationService.updatePostulation(id, updatedPostulation);
            return ResponseEntity.ok(postulation);
        } catch (Exception e) {
            return ResponseEntity.status(404).body(null);
        }
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePostulation(@PathVariable Long id) {
        try {
            postulationService.deletePostulation(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(404).build();
        }
    }

}


