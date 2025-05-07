package com.example.backendnourpfe.service;

import com.example.backendnourpfe.Respository.AvisRepository;
import com.example.backendnourpfe.Respository.DemandeRepository;
import com.example.backendnourpfe.Respository.UtilisateurRepository;
import com.example.backendnourpfe.classes.Avis;
import com.example.backendnourpfe.classes.UserRole;
import com.example.backendnourpfe.classes.Utilisateur;
import com.example.backendnourpfe.interfacee.AvisInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

@Service
public class AvisService  implements AvisInterface {
    @Autowired
    private AvisRepository avisRepository;
    @Autowired
    private  UtilisateurRepository utilisateurRepository;




    public List<Avis> getAvisParprestatitr(Utilisateur avisUtilisateur) {
        return avisRepository.findByAvisUtilisateur(avisUtilisateur);
    }

    public List<Avis> getAvisParparticulier(Utilisateur utilisateur) {
        return avisRepository.findByUtilisateur(utilisateur);
    }
    public void deleteAvis(Long idAvis) {
        avisRepository.deleteById(idAvis);
    }
    public Avis updateAvis(Long idAvis, Avis updatedAvis) {
        Avis existingAvis = avisRepository.findById(idAvis)
                .orElseThrow(() -> new RuntimeException("Avis non trouvé avec l'id : " + idAvis));

        existingAvis.setCommentaire(updatedAvis.getCommentaire());
        existingAvis.setNote(updatedAvis.getNote());
        existingAvis.setDateAvis(new Date());

        return avisRepository.save(existingAvis);
    }
    public double calculerScoreMoyen(Long utilisateurId) {

        List<Avis> avisList = avisRepository.findByAvisUtilisateurIdUtilisateur(utilisateurId);

        if (avisList.isEmpty()) {
            return 0;
        }

        double totalNotes = 0;
        for (Avis avis : avisList) {
            totalNotes += avis.getNote();
        }

        int nombreAvis = avisList.size();
        int k = 2;

        double score = totalNotes / (nombreAvis + k);


        score = Math.round(score * 10.0) / 10.0;

        return score;
    }


        public List<Map<String, Object>> getAllScoresMoyens() {
            List<Utilisateur> utilisateurs = utilisateurRepository.findByRoleIn(Arrays.asList(UserRole.PRESTATAIRE, UserRole.ENTREPRISE));
        List<Map<String, Object>> result = new ArrayList<>();
        int k = 2;

        for (Utilisateur utilisateur : utilisateurs) {
            List<Avis> avisList = avisRepository.findByAvisUtilisateurIdUtilisateur(utilisateur.getIdUtilisateur());


            double totalNotes = avisList.stream().mapToDouble(Avis::getNote).sum();
            int nombreAvis = avisList.size();


            double moyenne = nombreAvis == 0 ? 0 : totalNotes / nombreAvis;


            double scoreMoyen = moyenne * (nombreAvis / (double)(nombreAvis + k));


            scoreMoyen = Math.min(scoreMoyen, 4.9);


            String badge = getBadgeForScore(scoreMoyen);


            if (scoreMoyen >= 4.9) {
                badge = "Superstar";
            }

            utilisateur.setBadge(badge); // Affecter le badge à l'utilisateur

            // Sauvegarder l'utilisateur avec son nouveau badge dans la base de données
            utilisateurRepository.save(utilisateur);

            // Préparation des résultats à retourner
            Map<String, Object> map = new HashMap<>();
            map.put("id", utilisateur.getIdUtilisateur());
            map.put("nom", utilisateur.getNom());

            // Arrondir le score à une seule décimale
            double scoreMoyenArrondi = Math.round(scoreMoyen * 10.0) / 10.0;
            map.put("score", scoreMoyenArrondi);

            map.put("image", utilisateur.getImage());
            map.put("badge", badge);
            result.add(map);
        }

        return result;
    }


    private String getBadgeForScore(double score) {
        if (score >= 4.5) {
            return "Excellent";
        } else if (score >= 3.5) {
            return "Bon";
        } else if (score >= 2.5) {
            return "Moyenne";
        } else {
            return "Faible";
        }
    }


    public long getNombreAvisPourUtilisateur(Long idUtilisateur) {
        return avisRepository.countByUtilisateurId(idUtilisateur);
    }
    public List<Avis> getBestAvisTopPerUtilisateur() {
        return avisRepository.findTopAvisByAvisUtilisateur();



    }

    public List<Avis> getAllAvis() {
        return avisRepository.findAll();
    }
}