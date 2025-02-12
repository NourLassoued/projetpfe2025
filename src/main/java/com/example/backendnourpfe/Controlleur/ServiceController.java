package com.example.backendnourpfe.Controlleur;

import com.example.backendnourpfe.classes.Servicee;
import com.example.backendnourpfe.classes.Utilisateur;
import com.example.backendnourpfe.service.ServiService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/services")
@RequiredArgsConstructor
class ServiceController {
    @Autowired
    private ServiService serviceService;

    @GetMapping
    public List<Servicee> getAll() { return serviceService.getAllServices(); }

    @PostMapping
    public Servicee create(@RequestBody Servicee service) { return serviceService.createService(service); }

    @PutMapping("/{id}")
    public Servicee update(@PathVariable Long id, @RequestBody Servicee service) {
        return serviceService.updateService(id, service);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { serviceService.deleteService(id); }
    @PostMapping("/{categorieId}/addService")
    public Servicee addServiceToCategory(@PathVariable Long categorieId, @RequestBody Servicee service) {
        return serviceService.ajouterServiceAuCategorie(categorieId, service);
    }
    @GetMapping("/par-service/{serviceId}/sorted-by-rating")
    public ResponseEntity<List<Utilisateur>> getUtilisateursByServiceOrderedByRating(@PathVariable Long serviceId) {
        List<Utilisateur> utilisateurs = serviceService.getUtilisateursByServiceOrderedByRating(serviceId);
        return ResponseEntity.ok(utilisateurs);
    }
    @GetMapping("/categorie/{categorieId}")
    public List<Servicee> getAllServicesByCategorie(@PathVariable Long categorieId) {
        return serviceService.getAllServicesByCategorie(categorieId);
    }
    @GetMapping("/par-service/{serviceId}")
    public ResponseEntity<List<Utilisateur>> getUtilisateursByService(@PathVariable Long serviceId) {
        List<Utilisateur> utilisateurs = serviceService.getUtilisateursByService(serviceId);
        return ResponseEntity.ok(utilisateurs);
    }
}
