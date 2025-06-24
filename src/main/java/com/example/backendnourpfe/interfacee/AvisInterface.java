package com.example.backendnourpfe.interfacee;

import com.example.backendnourpfe.classes.Avis;
import com.example.backendnourpfe.classes.Utilisateur;

import java.util.List;

public interface AvisInterface {
     List<Avis> getAvisParprestatitr(Utilisateur avisUtilisateur);
     List<Avis> getAvisParparticulier(Utilisateur utilisateur);
     void deleteAvis(Long idAvis) ;
     double calculerScoreMoyen(Long utilisateurId);

}
