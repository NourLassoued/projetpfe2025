package com.example.backendnourpfe.controlleur;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
@RestController

@CrossOrigin(origins = "*")
@RequestMapping("/api/v1/auth")

public class FileControlleur {

    @Value("${upload.dir}")
    private String UPLOAD_DIR;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return new ResponseEntity<>("The file is empty", HttpStatus.BAD_REQUEST);
        }

        try {
            String contentType = file.getContentType();
            if (contentType == null ||
                    (!contentType.equals("application/pdf") &&
                            !contentType.startsWith("image/"))) {
                return new ResponseEntity<>("Invalid file type. Only images and PDFs are allowed.", HttpStatus.BAD_REQUEST);
            }

            byte[] bytes = file.getBytes();
            Path path = Paths.get(UPLOAD_DIR + file.getOriginalFilename());
            Files.createDirectories(path.getParent());
            Files.write(path, bytes);
            return new ResponseEntity<>("File uploaded successfully: " + file.getOriginalFilename(), HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<>("Failed to upload file: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /*
    @GetMapping("/get-image/{filename:.+}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) {
        try {
            Path file = Paths.get(UPLOAD_DIR).resolve(filename);
            Resource resource = new UrlResource(file.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }

            String contentType = Files.probeContentType(file);

            // Si le type n'est pas détecté, vérifier manuellement l'extension
            if (contentType == null) {
                if (filename.toLowerCase().endsWith(".pdf")) {
                    contentType = "application/pdf";
                } else if (filename.toLowerCase().endsWith(".jpg") || filename.toLowerCase().endsWith(".jpeg")) {
                    contentType = "image/jpeg";
                } else if (filename.toLowerCase().endsWith(".png")) {
                    contentType = "image/png";
                } else {
                    contentType = "application/octet-stream"; // Type par défaut pour les fichiers inconnus
                }
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}*/
    @GetMapping("/get-image/{filename:.+}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) {
        try {
            // On récupère le chemin configuré dans application.properties
            String configuredDir = UPLOAD_DIR; // ex: "C:/xampppidev/htdocs/img/"

            String actualDir;

            // Si on est sous Linux (ex: dans conteneur), on remplace la racine Windows par /C
            if (System.getProperty("os.name").toLowerCase().contains("linux") && configuredDir.startsWith("C:/")) {
                actualDir = configuredDir.replace("C:", "");
                actualDir = actualDir.replace("\\", "/"); // Juste pour être sûr
                // actualDir = "/C/xampppidev/htdocs/img/"
            } else {
                // sinon on garde le chemin Windows (local dev)
                actualDir = configuredDir;
            }

            Path file = Paths.get(actualDir).resolve(filename);

            Resource resource = new UrlResource(file.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }

            String contentType = Files.probeContentType(file);

            if (contentType == null) {
                if (filename.toLowerCase().endsWith(".pdf")) {
                    contentType = "application/pdf";
                } else if (filename.toLowerCase().endsWith(".jpg") || filename.toLowerCase().endsWith(".jpeg")) {
                    contentType = "image/jpeg";
                } else if (filename.toLowerCase().endsWith(".png")) {
                    contentType = "image/png";
                } else {
                    contentType = "application/octet-stream";
                }
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(resource);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
