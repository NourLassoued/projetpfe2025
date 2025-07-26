package com.example.backendnourpfe.controlleur;

import com.example.backendnourpfe.respository.AvisRepository;
import com.example.backendnourpfe.respository.UtilisateurRepository;
import com.example.backendnourpfe.classes.Avis;
import com.example.backendnourpfe.classes.Utilisateur;
import com.example.backendnourpfe.service.AvisService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/avis")
public class AvisController {

    private final UtilisateurRepository utilisateurRepository;
    private final AvisService avisService;
    private final AvisRepository avisRepository;

    public AvisController(UtilisateurRepository utilisateurRepository,
                          AvisService avisService,
                          AvisRepository avisRepository) {
        this.utilisateurRepository = utilisateurRepository;
        this.avisService = avisService;
        this.avisRepository = avisRepository;
    }

    @GetMapping("/utilisateur/{id}")
    public List<Avis> getAvisParprestatitr(@PathVariable("id") Long utilisateurId) {
        Utilisateur utilisateur = new Utilisateur();
        utilisateur.setIdUtilisateur(utilisateurId);
        return avisService.getAvisParprestatitr(utilisateur);
    }
    @GetMapping("/score/{id}")
    public double calculerScoreMoyen(@PathVariable("id") Long utilisateurId) {
        return avisService.calculerScoreMoyen(utilisateurId);
    }

    @GetMapping("/count/{idUtilisateur}")
    public ResponseEntity<Long> getNombreAvisPourUtilisateur(@PathVariable Long idUtilisateur) {
        long count = avisService.getNombreAvisPourUtilisateur(idUtilisateur);
        return ResponseEntity.ok(count);
    }
    @GetMapping("/scores-moyens")
    public ResponseEntity<List<Map<String, Object>>> getScoresMoyens() {
        return ResponseEntity.ok(avisService.getAllScoresMoyens());
    }



    @GetMapping("/parparticulier/{id}")
    public List<Avis> getAvisParParticulier(@PathVariable("id") Long utilisateurId) {

        Optional<Utilisateur> utilisateurOpt = utilisateurRepository.findById(utilisateurId);

        if (utilisateurOpt.isEmpty()) {

            return null;
        }

        Utilisateur utilisateur = utilisateurOpt.get();


        return avisService.getAvisParparticulier(utilisateur);
    }
    @DeleteMapping("/avis/{idAvis}")
    public void deleteAvis(@PathVariable("idAvis") Long idAvis) {
        avisService.deleteAvis(idAvis);
    }
    @PutMapping("/avis/{idAvis}")
    public ResponseEntity<Avis> updateAvis(@PathVariable Long idAvis, @RequestBody Avis updatedAvis) {
        Optional<Avis> optionalAvis = avisRepository.findById(idAvis);

        if (optionalAvis.isPresent()) {
            Avis existingAvis = optionalAvis.get();
            existingAvis.setCommentaire(updatedAvis.getCommentaire());
            existingAvis.setNote(updatedAvis.getNote());
            existingAvis.setDateAvis(new Date());

            avisRepository.save(existingAvis);
            return ResponseEntity.ok(existingAvis);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/best-by-user")
    public List<Avis> getTopAvisByUtilisateur() {
        return avisService.getBestAvisTopPerUtilisateur();
    }
    @GetMapping("/getAllAvis")
    public List<Avis> getAllAvis() {
        return avisService.getAllAvis();
    }

}

