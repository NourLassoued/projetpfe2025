package com.example.backendnourpfe.interfacee;

import com.example.backendnourpfe.classes.Avis;
import com.example.backendnourpfe.classes.Utilisateur;

import java.util.List;

public interface AvisInterface {
    public List<Avis> getAvisParprestatitr(Utilisateur avisUtilisateur);
    public List<Avis> getAvisParparticulier(Utilisateur utilisateur);
    public void deleteAvis(Long idAvis) ;
    public double calculerScoreMoyen(Long utilisateurId);

}
