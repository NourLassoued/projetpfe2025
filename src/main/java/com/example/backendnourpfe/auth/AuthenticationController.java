package com.example.backendnourpfe.auth;



import com.example.backendnourpfe.Config.LogoutService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AuthenticationController {
    private  final  AuthenticationService service;
    private final LogoutService logoutService;
    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        // Vous pouvez ajouter d'autres actions de nettoyage si nécessaire
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok("Logged out successfully!");
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request
    )throws IOException {
        System.out.println("user added ! : ");

        return ResponseEntity.ok(service.register(request));
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationReponse> authenticate(
            @RequestBody AuthenticationRequest request
    ) throws IOException{
        System.out.println("Welcome : "+request.getEmail());
        return ResponseEntity.ok(service.autheticate(request));
    }

    @PostMapping("/refresh-token")
    public void refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {
        service.refreshToken(request, response);
    }


}


