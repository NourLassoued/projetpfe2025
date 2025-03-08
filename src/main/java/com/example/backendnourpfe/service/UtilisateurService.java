package com.example.backendnourpfe.service;


import com.example.backendnourpfe.Config.JwtService;
import com.example.backendnourpfe.Respository.*;
import com.example.backendnourpfe.classes.*;
import com.example.backendnourpfe.interfacee.UtlisateurInterface;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

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
    @Autowired
    private JwtService jwtService;
    @Autowired
    private  DisponibiliteRepository disponibiliteRepository;
    @Autowired
    private DisponibiliteService disponibiliteService;
    @Autowired
    private AdresseRepository adresseRepository;


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


        if (utilisateur.getRole() != UserRole.PARTICULIER) {
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

    public boolean checkEmailExists(String email) {
        return utilisateurRepository.existsByEmail(email);
    }

    @Transactional
    public ResponseEntity<?> updateUser(Long id, Utilisateur utilisateurDetails) {
        Utilisateur user = utilisateurRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur non trouvé !"));

        // 🔹 Met à jour les champs nécessaires
        if (utilisateurDetails.getNom() != null) user.setNom(utilisateurDetails.getNom());
        if (utilisateurDetails.getEmail() != null) user.setEmail(utilisateurDetails.getEmail());
        if (utilisateurDetails.getPassword() != null) user.setPassword(utilisateurDetails.getPassword());
        if (utilisateurDetails.getImage() != null) user.setImage(utilisateurDetails.getImage());
        if (utilisateurDetails.getTelephoneNumber() != null) user.setTelephoneNumber(utilisateurDetails.getTelephoneNumber());
      if(utilisateurDetails.getAdressee()!=null)user.setAdressee(utilisateurDetails.getAdressee());
        if (utilisateurDetails.getRole() != null) user.setRole(utilisateurDetails.getRole());
        if (utilisateurDetails.getStatus() != null) user.setStatus(utilisateurDetails.getStatus());
        if (utilisateurDetails.getCertification() != null) user.setCertification(utilisateurDetails.getCertification());
        if (utilisateurDetails.getTarifs() != null) user.setTarifs(utilisateurDetails.getTarifs());
        if (utilisateurDetails.getDescription() != null) user.setDescription(utilisateurDetails.getDescription());
        if (utilisateurDetails.getCompetence() != null && !utilisateurDetails.getCompetence().isEmpty())
            user.setCompetence(utilisateurDetails.getCompetence());
        if (utilisateurDetails.getSolde() != null) user.setSolde(utilisateurDetails.getSolde());
        if (utilisateurDetails.getWorkExperience() != null) user.setWorkExperience(utilisateurDetails.getWorkExperience());
        if (utilisateurDetails.getNomEntreprise() != null) user.setNomEntreprise(utilisateurDetails.getNomEntreprise());
        if (utilisateurDetails.getSiret() != null) user.setSiret(utilisateurDetails.getSiret());
        if (utilisateurDetails.getSiteWeb() != null) user.setSiteWeb(utilisateurDetails.getSiteWeb());
        if (utilisateurDetails.getDoucument_cv() != null) user.setDoucument_cv(utilisateurDetails.getDoucument_cv());
        if (utilisateurDetails.getDoucument_CIN() != null) user.setDoucument_CIN(utilisateurDetails.getDoucument_CIN());
        if (utilisateurDetails.getDisponibilites() != null) {
            for (Disponibilite dispo : utilisateurDetails.getDisponibilites()) {
                dispo.setPrestataire(user); // Associer à l'utilisateur

                if (dispo.getId() != null) {
                    // Vérifier si la disponibilité existe en base
                    Optional<Disponibilite> existingDispo = disponibiliteRepository.findById(dispo.getId());
                    if (existingDispo.isPresent()) {
                        // Mise à jour de la disponibilité existante
                        Disponibilite dispoToUpdate = existingDispo.get();
                        dispoToUpdate.setJour(dispo.getJour());
                        dispoToUpdate.setHeureDebut(dispo.getHeureDebut());
                        dispoToUpdate.setHeureFin(dispo.getHeureFin());
                        disponibiliteRepository.save(dispoToUpdate); // Enregistrer la mise à jour
                    } else {
                        // Si l'ID est donné mais qu'il n'existe pas en base, on l'ajoute comme une nouvelle
                        disponibiliteRepository.save(dispo);
                        user.getDisponibilites().add(dispo);
                    }
                } else {
                    // Si pas d'ID, c'est une nouvelle disponibilité à ajouter
                    disponibiliteRepository.save(dispo);
                    user.getDisponibilites().add(dispo);
                }
            }
        }



        Utilisateur updatedUser = utilisateurRepository.save(user);






        System.out.println("Utilisateur mis à jour avec succès: " + updatedUser.getNom());
        System.out.println("Total disponibilités après mise à jour: " + updatedUser.getDisponibilites().size())
        ;

        String newToken = jwtService.generateToken(updatedUser);
        System.out.println(" Nouveau token généré : " + newToken);


        return ResponseEntity.ok(Map.of(
                "message", "Utilisateur mis à jour avec succès",
                "token", newToken,
                "user", updatedUser
        ));
    }
/*
    public Utilisateur affecterAdresse(Long utilisateurId, Long adresseId) {
        Utilisateur utilisateur = utilisateurRepository.findById(utilisateurId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        Adresse adressee = adresseRepository.findById(adresseId)
                .orElseThrow(() -> new RuntimeException("Adresse non trouvée"));

        utilisateur.setAdressee(adressee);
        return utilisateurRepository.save(utilisateur);

    }*/
public Map<String, Object> affecterAdresse(Long utilisateurId, Long adresseId) {
    Utilisateur utilisateur = utilisateurRepository.findById(utilisateurId)
            .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

    Adresse adresse = adresseRepository.findById(adresseId)
            .orElseThrow(() -> new RuntimeException("Adresse non trouvée"));

    utilisateur.setAdressee(adresse);
    Utilisateur updatedUser = utilisateurRepository.save(utilisateur);

    // Générer un nouveau token après la mise à jour
    String newToken = jwtService.generateToken(updatedUser);
    System.out.println("🚀 Nouveau token généré : " + newToken);

    // Retourner les informations sous forme de Map
    Map<String, Object> response = new HashMap<>();
    response.put("message", "Adresse affectée avec succès !");
    response.put("token", newToken);
    response.put("user", updatedUser);

    return response;
}


    public Optional<Utilisateur> getUtilisateurById(Long id) {
        return utilisateurRepository.findById(id);
    }
}







