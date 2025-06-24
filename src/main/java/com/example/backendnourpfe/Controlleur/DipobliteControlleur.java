package com.example.backendnourpfe.Controlleur;

import com.example.backendnourpfe.classes.Disponibilite;
import com.example.backendnourpfe.service.DisponibiliteService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/disponibilites")
public class DipobliteControlleur {
    private final DisponibiliteService disponibiliteService;

    public DipobliteControlleur(DisponibiliteService disponibiliteService) {
        this.disponibiliteService = disponibiliteService;
    }


    @PostMapping("/{prestataire_id}")
    public ResponseEntity<Map<String, Object>> ajouterDisponibilite(
            @PathVariable Long prestataire_id,
            @RequestBody Disponibilite disponibilite) {

        Map<String, Object> response = disponibiliteService.ajouterDisponibilite(prestataire_id, disponibilite);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateDisponibilite(
            @PathVariable Long id,
            @RequestBody Disponibilite nouvelleDisponibilite) {

        Map<String, Object> response = disponibiliteService.modifierDisponibilite(id, nouvelleDisponibilite);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{prestataireId}")
    public ResponseEntity<List<Disponibilite>> getDisponibilitesByPrestataire(@PathVariable Long prestataireId) {
        List<Disponibilite> disponibilites = disponibiliteService.getDisponibilitesByPrestataire(prestataireId);
        return ResponseEntity.ok(disponibilites);
    }

@DeleteMapping("/{id}")
public ResponseEntity<Map<String, Object>> supprimerDisponibilite(@PathVariable("id") Long id) {
    try {
        Map<String, Object> response = disponibiliteService.supprimerDisponibilite(id);
        return ResponseEntity.ok(response);
    } catch (RuntimeException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.singletonMap("error", e.getMessage()));
    }
}


}


