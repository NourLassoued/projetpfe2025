package com.example.backendnourpfe.Controlleur;

import com.example.backendnourpfe.classes.Categorie;
import com.example.backendnourpfe.service.CategorieService;
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

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/categories")
@RequiredArgsConstructor


    public class CategorieController {

    @Autowired
    private CategorieService categorieService;


    @GetMapping("/getAllCategories")
    public List<Categorie> getAllCategories() {
        return categorieService.getAll();
    }
/*
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)

    public Categorie createCategorie(@RequestBody Categorie categorie) {
        return categorieService.create(categorie);
    }*/
@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
public ResponseEntity<Categorie> createCategorie(
        @RequestParam("nom") String nom,
        @RequestParam("description") String description,
        @RequestParam("tarif") Float tarif,
        @RequestParam(value = "imageCategorie", required = false) MultipartFile imageFile) {

    String imagePath = null;

    // Vérifier si un fichier image est envoyé
    if (imageFile != null && !imageFile.isEmpty()) {
        try {
            String uploadDir = "C:/xampppidev/htdocs/img/";
            Path path = Paths.get(uploadDir + imageFile.getOriginalFilename());
            Files.createDirectories(path.getParent());
            Files.write(path, imageFile.getBytes());
            imagePath = imageFile.getOriginalFilename(); // Stocker seulement le nom du fichier
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // Créer une nouvelle catégorie avec les valeurs reçues
    Categorie categorie = new Categorie();
    categorie.setNom(nom);
    categorie.setDescription(description);
    categorie.setTarif(tarif);
    categorie.setImageCategorie(imagePath); // Stocke seulement le nom du fichier

    Categorie savedCategorie = categorieService.create(categorie);

    return ResponseEntity.ok(savedCategorie);
}







    @PutMapping("/{id}")
    public Categorie updateCategorie(@PathVariable Long id, @RequestBody Categorie categorie) {
        return categorieService.update(id, categorie);
    }


    @DeleteMapping("/{id}")
    public void deleteCategorie(@PathVariable Long id) {
        categorieService.deleteCategorie(id);
    }

}

