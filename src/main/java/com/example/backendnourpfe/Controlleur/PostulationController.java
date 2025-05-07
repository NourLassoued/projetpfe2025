package com.example.backendnourpfe.Controlleur;

import com.example.backendnourpfe.classes.Postulation;
import com.example.backendnourpfe.service.PostulationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins ="*")
@RequestMapping("/postulation")
public class PostulationController {

    @Autowired
    private PostulationService postulationService;

    @GetMapping("/demande/{demandeId}")
    public ResponseEntity<List<Postulation>> getPostulationsByDemande(@PathVariable Long demandeId) {
        List<Postulation> postulations = postulationService.getPostulationsByDemande(demandeId);
        return ResponseEntity.ok(postulations);
    }

}
