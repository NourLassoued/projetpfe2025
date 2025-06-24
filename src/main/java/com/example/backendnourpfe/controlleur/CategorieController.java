package com.example.backendnourpfe.controlleur;

import com.example.backendnourpfe.classes.Categorie;
import com.example.backendnourpfe.service.CategorieService;

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

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/categories")



    public class CategorieController {
    private final CategorieService categorieService;

    public CategorieController(CategorieService categorieService) {
        this.categorieService = categorieService;
    }

    @GetMapping("/getAllCategories")
    public List<Categorie> getAllCategories() {
        return categorieService.getAll();
    }

@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
public ResponseEntity<Categorie> createCategorie(
        @RequestParam("nom") String nom,
        @RequestParam("description") String description,
        @RequestParam("tarif") Float tarif,
        @RequestParam(value = "imageCategorie", required = false) MultipartFile imageFile) {

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


    Categorie categorie = new Categorie();
    categorie.setNom(nom);
    categorie.setDescription(description);
    categorie.setTarif(tarif);
    categorie.setImageCategorie(imagePath);

    Categorie savedCategorie = categorieService.create(categorie);

    return ResponseEntity.ok(savedCategorie);
}






    @PutMapping("/{id}")
    public ResponseEntity<Categorie> updateCategorie(
            @PathVariable Long id,
            @RequestParam("nom") String nom,
            @RequestParam("description") String description,
            @RequestParam("tarif") Float tarif,
            @RequestParam(value = "imageCategorie", required = false) MultipartFile imageFile) {


        Categorie existingCategorie = categorieService.findById(id);
        if (existingCategorie == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }


        existingCategorie.setNom(nom);
        existingCategorie.setDescription(description);
        existingCategorie.setTarif(tarif);


        if (imageFile != null && !imageFile.isEmpty()) {
            try {
                String uploadDir = "C:/xampppidev/htdocs/img/";
                Path path = Paths.get(uploadDir + imageFile.getOriginalFilename());
                Files.createDirectories(path.getParent());
                Files.write(path, imageFile.getBytes());
                existingCategorie.setImageCategorie(imageFile.getOriginalFilename()); // Mettre à jour l'image
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
            }
        }


        Categorie updatedCategorie = categorieService.update(id, existingCategorie);

        return ResponseEntity.ok(updatedCategorie);
    }
    @GetMapping("/search")
    public List<Categorie> searchCategories(@RequestParam(name = "nom", required = false, defaultValue = "") String nom) {
        return categorieService.searchCategoriesByName(nom);
    }


    @DeleteMapping("/{id}")
    public void deleteCategorie(@PathVariable Long id) {
        categorieService.deleteCategorie(id);
    }

}

