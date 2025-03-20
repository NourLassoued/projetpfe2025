package com.example.backendnourpfe.Controlleur;

import com.example.backendnourpfe.Respository.CategorieRepository;
import com.example.backendnourpfe.classes.Categorie;
import com.example.backendnourpfe.classes.Servicee;
import com.example.backendnourpfe.classes.Utilisateur;
import com.example.backendnourpfe.service.CategorieService;
import com.example.backendnourpfe.service.ServiService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/services")
@RequiredArgsConstructor
class ServiceController {
    @Autowired
    private ServiService serviceService;
    @Autowired
    private CategorieService categorieService;
    @Autowired
    private CategorieRepository categorieRepository;

    @GetMapping
    public List<Servicee> getAll() { return serviceService.getAllServices(); }

    @PostMapping
    public Servicee create(@RequestBody Servicee service) { return serviceService.createService(service); }
/*
    @PutMapping("/{id}")
    public Servicee update(@PathVariable Long id, @RequestBody Servicee service) {
        return serviceService.updateService(id, service);
    }*/
@PutMapping("/{id}")
public ResponseEntity<Servicee> updateService(
        @PathVariable Long id,
        @RequestParam("nomservice") String nomservice,
        @RequestParam("description") String description,
        @RequestParam("tarif") Float tarif,
        @RequestParam(value = "imageService", required = false) MultipartFile imageFile) {

    Servicee existingService = serviceService.findById(id);
    if (existingService == null) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }

    existingService.setNomservice(nomservice);
    existingService.setDescription(description);
    existingService.setTarif(tarif);

    if (imageFile != null && !imageFile.isEmpty()) {
        try {
            String uploadDir = "C:/xampppidev/htdocs/img/";
            Path path = Paths.get(uploadDir + imageFile.getOriginalFilename());
            Files.createDirectories(path.getParent());
            Files.write(path, imageFile.getBytes());
            existingService.setImageService(imageFile.getOriginalFilename());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    Servicee updatedService = serviceService.updateService(id, existingService);
    return ResponseEntity.ok(updatedService);
}

    @GetMapping("/categorie-name/{categorieName}")
    public ResponseEntity<List<Servicee>> getServicesByCategoryName(@PathVariable String categorieName) {
        // Trouver la catégorie par nom
        Optional<Categorie> categorieOptional = categorieRepository.findByNom(categorieName);

        if (categorieOptional.isEmpty()) {
            return ResponseEntity.noContent().build(); // Si la catégorie n'est pas trouvée
        }

        // Récupérer la liste des services associés à cette catégorie
        List<Servicee> services = categorieOptional.get().getServices();

        // Retourner la liste des services dans la réponse
        return ResponseEntity.ok(services);
    }


    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { serviceService.deleteService(id); }

   @PostMapping(value = "/{categorieId}/addService", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)

   public ResponseEntity<Servicee> addServiceToCategory(
           @PathVariable Long categorieId,
           @RequestParam("nomservice") String nomservice,
           @RequestParam("description") String description,
           @RequestParam("tarif") Float tarif,
           @RequestParam(value = "imageService", required = false) MultipartFile imageFile) {


       Categorie existingCategorie = categorieService.findById(categorieId);
       if (existingCategorie == null) {
           return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
       }

       String imagePath = null;


       if (imageFile != null && !imageFile.isEmpty()) {
           try {
               String uploadDir = "C:/xampppidev/htdocs/img/";
               Path path = Paths.get(uploadDir + imageFile.getOriginalFilename());
               Files.createDirectories(path.getParent());
               Files.write(path, imageFile.getBytes());
               imagePath = imageFile.getOriginalFilename();
           } catch (IOException e) {
               return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
           }
       }


       Servicee newService = new Servicee();
       newService.setNomservice(nomservice);
       newService.setDescription(description);
newService.setTarif(tarif);
       newService.setImageService(imagePath);


       existingCategorie.getServices().add(newService);
       serviceService.ajouterServiceAuCategorie(categorieId, newService);


       return ResponseEntity.status(HttpStatus.CREATED).body(newService);
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
    @GetMapping("/search")
    public List<Servicee> rechercherService(@RequestParam String nom) {
        return serviceService.rechercherParNom(nom);
    }
}
