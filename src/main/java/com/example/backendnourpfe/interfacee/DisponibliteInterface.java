package com.example.backendnourpfe.interfacee;

import com.example.backendnourpfe.classes.Disponibilite;


import java.util.List;
import java.util.Map;

public interface DisponibliteInterface {

    Map<String, Object> ajouterDisponibilite(Long prestataire_id, Disponibilite disponibilite);
     Map<String, Object> modifierDisponibilite(Long disponibiliteId, Disponibilite nouvelleDisponibilite);

     Map<String, Object> supprimerDisponibilite(Long disponibiliteId);

     List<Disponibilite> getDisponibilitesByPrestataire(Long prestataireId);

}
