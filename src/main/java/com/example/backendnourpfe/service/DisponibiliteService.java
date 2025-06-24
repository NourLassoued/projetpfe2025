package com.example.backendnourpfe.service;

import com.example.backendnourpfe.config.JwtService;
import com.example.backendnourpfe.respository.DisponibiliteRepository;
import com.example.backendnourpfe.respository.UtilisateurRepository;
import com.example.backendnourpfe.classes.Disponibilite;
import com.example.backendnourpfe.classes.Utilisateur;
import com.example.backendnourpfe.interfacee.DisponibliteInterface;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
@RequiredArgsConstructor
@Service
public class DisponibiliteService implements DisponibliteInterface {
    private final DisponibiliteRepository disponibiliteRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final JwtService jwtService;



    @Override
    @Transactional
    public Map<String, Object> ajouterDisponibilite(Long prestataire_id, Disponibilite disponibilite) {
        Utilisateur prestataire = utilisateurRepository.findById(prestataire_id)
                .orElseThrow(() -> new RuntimeException("Prestataire non trouvé !"));

        disponibilite.setPrestataire(prestataire);
        Disponibilite nouvelleDispo = disponibiliteRepository.save(disponibilite);


        String nouveauToken = jwtService.generateToken(disponibilite.getPrestataire());


        Map<String, Object> response = new HashMap<>();
        response.put("disponibilite", nouvelleDispo);
        response.put("token", nouveauToken);

        return response;
    }



@Override
@Transactional
public Map<String, Object> supprimerDisponibilite(Long disponibiliteId) {
    Disponibilite disponibilite = disponibiliteRepository.findById(disponibiliteId)
            .orElseThrow(() -> new RuntimeException(" Disponibilité non trouvée !"));

    Utilisateur prestataire = disponibilite.getPrestataire();


    disponibiliteRepository.delete(disponibilite);

    boolean existeEncore = disponibiliteRepository.existsById(disponibiliteId);
    if (existeEncore) {
        throw new RuntimeException("la disponibilité n'a pas été supprimée !");
    }


    String nouveauToken = jwtService.generateToken(prestataire);


    Map<String, Object> response = new HashMap<>();
    response.put("message", "Disponibilité supprimée avec succès !");
    response.put("token", nouveauToken);

    return response;
}


    @Override
    @Transactional(readOnly = true)
    public List<Disponibilite> getDisponibilitesByPrestataire(Long prestataireId) {
        return disponibiliteRepository.findByPrestataire_IdUtilisateur(prestataireId);
    }








    @Transactional
    public Map<String, Object> modifierDisponibilite(Long disponibiliteId, Disponibilite nouvelleDisponibilite) {
        Disponibilite disponibilite = disponibiliteRepository.findById(disponibiliteId)
                .orElseThrow(() -> new RuntimeException("Disponibilité non trouvée !"));

        if (nouvelleDisponibilite.getJour() != null) {
            disponibilite.setJour(nouvelleDisponibilite.getJour());
        }
        if (nouvelleDisponibilite.getHeureDebut() != null) {
            disponibilite.setHeureDebut(nouvelleDisponibilite.getHeureDebut());
        }
        if (nouvelleDisponibilite.getHeureFin() != null) {
            disponibilite.setHeureFin(nouvelleDisponibilite.getHeureFin());
        }

        disponibiliteRepository.save(disponibilite);


        String nouveauToken = jwtService.generateToken(disponibilite.getPrestataire());

        Map<String, Object> response = new HashMap<>();
        response.put("disponibilite", disponibilite);
        response.put("token", nouveauToken);

        return response;
    }


}