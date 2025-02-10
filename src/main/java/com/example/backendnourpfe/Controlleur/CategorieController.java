package com.example.backendnourpfe.Controlleur;

import com.example.backendnourpfe.classes.Categorie;
import com.example.backendnourpfe.service.CategorieService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor


    public class CategorieController {

    @Autowired
    private CategorieService categorieService;


    @GetMapping("/getAllCategories")
    public List<Categorie> getAllCategories() {
        return categorieService.getAll();
    }

    @PostMapping("/createCategorie")
    public Categorie createCategorie(@RequestBody Categorie categorie) {
        return categorieService.create(categorie);
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

