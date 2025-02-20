package com.example.backendnourpfe.service;


import com.example.backendnourpfe.Respository.*;
import com.example.backendnourpfe.classes.*;
import com.example.backendnourpfe.interfacee.UtlisateurInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import javax.management.ServiceNotFoundException;
import java.util.*;
import java.util.stream.Collectors;

@Service

public class UtilisateurService implements UtlisateurInterface {
    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private DemandeRepository demandeRepository;
    @Autowired
        private ServiceRepository serviceRepository;
    @Autowired
    private AvisRepository avisRepository;
    @Autowired
    private ReservationRepository reservationRepository;



    @Override
    public Utilisateur ajouterUtilisateur(Utilisateur utilisateur) {
        return utilisateurRepository.save(utilisateur);
    }


    @Override
    public void deleteUser(Long id) {

        utilisateurRepository.deleteById(id);
    }


@Override
public Map<String, Object> creerDemande(Long idUtilisateur, Long idservice, Demande demande) {
    Utilisateur utilisateur = utilisateurRepository.findById(idUtilisateur)
            .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

    if (utilisateur.getRole() != UserRole.PARTICULIER) {
        throw new RuntimeException("Seul un utilisateur avec le rôle 'Particulier' peut passer une demande.");
    }


    Servicee service = serviceRepository.findById(idservice)
            .orElseThrow(() -> new RuntimeException("Service non trouvé"));


    demande.setUtilisateur(utilisateur);
    demande.setServicee(service);
    demande.setStatusDemande(StatusDemande.EN_COURS);
    Demande savedDemande = demandeRepository.save(demande);


    List<Utilisateur> prestataires = utilisateurRepository.findUtilisateursByServiceOrderedByRating(idservice);


    Map<String, Object> response = new HashMap<>();
    response.put("demande", savedDemande);
    response.put("prestataires", prestataires);

    return response;
}


    @Override
    public Avis donnerAvis(Long idUtilisateur, Long idAvisUtilisateur, Avis avis) {

        Utilisateur utilisateur = utilisateurRepository.findById(idUtilisateur)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));


        if  (utilisateur.getRole() != UserRole.PARTICULIER) {
            throw new RuntimeException("Seul un utilisateur avec le rôle 'Particulier' peut donner un avis.");
        }


        Utilisateur avisUtilisateur = utilisateurRepository.findById(idAvisUtilisateur)
                .orElseThrow(() -> new RuntimeException("Utilisateur récepteur de l'avis non trouvé"));


        if (avisUtilisateur.getRole() != UserRole.PRESTATAIRE && avisUtilisateur.getRole() != UserRole.ENTREPRISE) {
            throw new RuntimeException("L'utilisateur récepteur de l'avis doit être un Prestataire ou une Entreprise.");
        }


        avis.setUtilisateur(utilisateur);
        avis.setAvisUtilisateur(avisUtilisateur);
        avis.setDateAvis(new Date());

        return avisRepository.save(avis);
    }
    @Override
    public List<Object> getAvisByAvisUtilisateur(Long idAvisUtilisateur) {

            return avisRepository.findAvisByAvisUtilisateurId(idAvisUtilisateur)
                    .stream()
                    .map(avis -> {
                        return new Object() {
                            public final Long idAvis = (Long) avis[0];
                            public final int note = (int) avis[1];
                            public final String commentaire = (String) avis[2];
                            public final String dateAvis = avis[3].toString();
                            public final String nomParticulier = (String) avis[4]; // Récupération du nom du particulier
                        };
                    })
                    .collect(Collectors.toList());
        }

    public Reservation creerReservation(Long idParticulier, Long idPrestataire, Reservation reservation) {

        Utilisateur particulier = utilisateurRepository.findById(idParticulier)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        if (particulier.getRole() != UserRole.PARTICULIER) {
            throw new RuntimeException("Seul un utilisateur avec le rôle 'Particulier' peut réserver.");
        }


        Utilisateur prestataire = utilisateurRepository.findById(idPrestataire)
                .orElseThrow(() -> new RuntimeException("Prestataire/Entreprise non trouvé"));
        if (prestataire.getRole() != UserRole.PRESTATAIRE && prestataire.getRole() != UserRole.ENTREPRISE) {
            throw new RuntimeException("L'utilisateur cible doit être un prestataire ou une entreprise.");
        }


        reservation.setParticulier(particulier);
        reservation.setPrestataire(prestataire);
        reservation.setDateReservation(new Date());
        reservation.setStatusReservation(StatusReservation.EN_ATTENTE);


        return reservationRepository.save(reservation);
    }
    public Utilisateur updateProfil(Long idUtilisateur, Utilisateur utilisateurDetails) {

        Utilisateur utilisateur = utilisateurRepository.findById(idUtilisateur)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));


        if (utilisateurDetails.getNom() != null) {
            utilisateur.setNom(utilisateurDetails.getNom());
        }
        if (utilisateurDetails.getEmail() != null) {
            utilisateur.setEmail(utilisateurDetails.getEmail());
        }
        if (utilisateurDetails.getTelephoneNumber() != 0) {
            utilisateur.setTelephoneNumber(utilisateurDetails.getTelephoneNumber());
        }
        if (utilisateurDetails.getAdresse() != null) {
            utilisateur.setAdresse(utilisateurDetails.getAdresse());
        }
        if (utilisateurDetails.getImage() != null) {
            utilisateur.setImage(utilisateurDetails.getImage());
        }
        if (utilisateurDetails.getDescription() != null) {
            utilisateur.setDescription(utilisateurDetails.getDescription());
        }
        if (utilisateurDetails.getSolde() != 0) {
            utilisateur.setSolde(utilisateurDetails.getSolde());
        }
        if (utilisateurDetails.getWorkExperience() != 0) {
            utilisateur.setWorkExperience(utilisateurDetails.getWorkExperience());
        }
        if (utilisateurDetails.getNomEntreprise() != null) {
            utilisateur.setNomEntreprise(utilisateurDetails.getNomEntreprise());
        }
        if (utilisateurDetails.getSiteWeb() != null) {
            utilisateur.setSiteWeb(utilisateurDetails.getSiteWeb());
        }
        if (utilisateurDetails.getSiret() != null) {
            utilisateur.setSiret(utilisateurDetails.getSiret());
        }/*
        if (utilisateurDetails.getPassword() != null && !utilisateurDetails.getPassword().isEmpty()) {
            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            String encodedPassword = passwordEncoder.encode(utilisateurDetails.getPassword());
            utilisateur.setPassword(encodedPassword);       }*/



        return utilisateurRepository.save(utilisateur);
    }
}







