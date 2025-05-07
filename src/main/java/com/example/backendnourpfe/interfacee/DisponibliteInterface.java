package com.example.backendnourpfe.interfacee;

import com.example.backendnourpfe.classes.Demande;
import com.example.backendnourpfe.classes.Disponibilite;
import com.example.backendnourpfe.classes.Utilisateur;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.Map;

public interface DisponibliteInterface {

   public Map<String, Object> ajouterDisponibilite(Long prestataire_id, Disponibilite disponibilite);
    public Map<String, Object> modifierDisponibilite(Long disponibiliteId, Disponibilite nouvelleDisponibilite);

    public Map<String, Object> supprimerDisponibilite(Long disponibiliteId);

    public List<Disponibilite> getDisponibilitesByPrestataire(Long prestataireId);

}
