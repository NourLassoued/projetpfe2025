package com.example.backendnourpfe.classes;

public enum UserRole {
    PRESTATAIRE,
    ADMINISTRATEUR,
    PARTICULIER,
    ENTREPRISE;

    public static UserRole getDefaultRole() {
        return PARTICULIER; // Rôle par défaut est MEMBRE
    }
    }



