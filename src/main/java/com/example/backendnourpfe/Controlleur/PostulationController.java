package com.example.backendnourpfe.Controlleur;

import com.example.backendnourpfe.classes.Postulation;
import com.example.backendnourpfe.service.PostulationService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins ="*")
@RequestMapping("/postulation")
public class PostulationController {

    private final PostulationService postulationService;

    public PostulationController(PostulationService postulationService) {
        this.postulationService = postulationService;
    }

    @GetMapping("/demande/{demandeId}")
    public ResponseEntity<List<Postulation>> getPostulationsByDemande(@PathVariable Long demandeId) {
        List<Postulation> postulations = postulationService.getPostulationsByDemande(demandeId);
        return ResponseEntity.ok(postulations);
    }

}
