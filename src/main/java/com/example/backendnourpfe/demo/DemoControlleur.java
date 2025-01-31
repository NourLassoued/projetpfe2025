package com.example.backendnourpfe.demo;

import io.swagger.v3.oas.annotations.Hidden;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Hidden
@AllArgsConstructor
@RequestMapping("/api/v1/DemoControlleur")
public class DemoControlleur {
    @GetMapping
    public ResponseEntity<String> sayHEllo(){
        return ResponseEntity.ok("hello from secured endPoint");
    }
}
