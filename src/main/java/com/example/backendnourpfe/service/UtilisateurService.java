package com.example.backendnourpfe.service;


import com.example.backendnourpfe.Config.JwtService;
import com.example.backendnourpfe.Controlleur.NotificationController;
import com.example.backendnourpfe.Respository.*;
import com.example.backendnourpfe.classes.*;
import com.example.backendnourpfe.interfacee.UtlisateurInterface;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.userdetails.UsernameNotFoundException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;


import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UtilisateurService implements UtlisateurInterface {
    private final NotificationController notificationController;
    private final UtilisateurRepository utilisateurRepository;
    private final DemandeRepository demandeRepository;
    private final ServiceRepository serviceRepository;
    private final AvisRepository avisRepository;
    private final EmailService emailService;
    private final JwtService jwtService;
    private final DisponibiliteRepository disponibiliteRepository;
    private final AdresseRepository adresseRepository;
    private final PostulationRepository postulationRepository;



    @Override
    public Utilisateur ajouterUtilisateur(Utilisateur utilisateur) {
        return utilisateurRepository.save(utilisateur);
    }


    @Override
    public void deleteUser(Long id) {

        utilisateurRepository.deleteById(id);
    }
    public List<Utilisateur> getAllUsers() {
        return utilisateurRepository.findAll();
    }

    public List<Utilisateur> getAllParticuliers() {
        List<Utilisateur> particuliers = utilisateurRepository.findAll().stream()
                .filter(user -> user.getRole() == UserRole.PARTICULIER)
                .map(user -> {
                    if (user.getAdressee() != null) {

                    } else {

                    }
                    return user;
                })
                .collect(Collectors.toList());
        return particuliers;
    }
    public List<Utilisateur> getAllEntreprises() {
        List<Utilisateur> entreprises = utilisateurRepository.findAll().stream()
                .filter(user -> user.getRole() == UserRole.ENTREPRISE) // Filtrer selon le rôle ENTREPRISE
                .map(user -> {
                    if (user.getAdressee() != null) {

                    } else {

                    }
                    return user;
                })
                .collect(Collectors.toList());
        return entreprises;
    }


    public List<Utilisateur> getAllPrestataires() {
        List<Utilisateur> prestataires = utilisateurRepository.findAllPrestatairesWithAdresse(UserRole.PRESTATAIRE);

        for (Utilisateur user : prestataires) {
            if (user.getAdressee() != null) {
                System.out.println("Adresse du prestataire : " + user.getAdressee().getIdAdresse());
            }
            if (!user.getDisponibilites().isEmpty()) {
                System.out.println("Disponibilités du prestataire : " + user.getDisponibilites());
            } else {
                System.out.println("Aucune disponibilité trouvée pour le prestataire : " + user.getIdUtilisateur());
            }
        }

        return prestataires;
    }

    public Utilisateur getUtilisateurFromToken(String token) {
        String email = jwtService.extractUsername(token);

        if (email == null) {
            throw new RuntimeException("Token invalide ou expiré");
        }

        return utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé avec l'email: " + email));
    }


    @Override
    public Map<String, Object> creerDemande(String emailUtilisateur, Long idService, Long idAdresse, Demande demande) {

        Utilisateur utilisateur = utilisateurRepository.findByEmail(emailUtilisateur)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        if (utilisateur.getRole() != UserRole.PARTICULIER) {
            throw new RuntimeException("Seul un utilisateur avec le rôle 'Particulier' peut passer une demande.");
        }

        Servicee service = serviceRepository.findById(idService)
                .orElseThrow(() -> new RuntimeException("Service non trouvé"));

        Adresse adresse = adresseRepository.findById(idAdresse)
                .orElseThrow(() -> new RuntimeException("Adresse non trouvée"));

        demande.setUtilisateur(utilisateur);
        demande.setServicee(service);
        demande.setAdressedemande(adresse);
        demande.setStatusDemande(StatusDemande.EN_COURS);

        Demande savedDemande = demandeRepository.save(demande);


        List<Utilisateur> tousPrestataires = utilisateurRepository.findUtilisateursByServiceOrderedByRating(idService);
        List<Utilisateur> prestatairesFiltres = new ArrayList<>();

        for (Utilisateur prestataire : tousPrestataires) {


            if (prestataire.getAdressee() == null || !prestataire.getAdressee().getIdAdresse().equals(idAdresse)) continue;

            for (Disponibilite dispo : prestataire.getDisponibilites()) {

                String jourDemande = convertirJourEnAnglais(dispo.getJour());
                LocalDateTime demandeDateTime = convertDateToLocalDateTime(savedDemande.getDate());
                String jourDemandeFormate = demandeDateTime.getDayOfWeek().toString();

                if (!jourDemandeFormate.equalsIgnoreCase(jourDemande)) continue;

                LocalTime heureDemande = demandeDateTime.toLocalTime();
                if (!heureDemande.isBefore(dispo.getHeureDebut()) && !heureDemande.isAfter(dispo.getHeureFin())) {

                    boolean dejaPostule = postulationRepository.existsByDemandeAndPrestataire(savedDemande, prestataire);
                    if (!dejaPostule) {
                        prestatairesFiltres.add(prestataire);
                        emailService.sendHtmlEmail(
                                prestataire.getEmail(),
                                "Nouvelle demande correspondant à votre disponibilité",
                                "<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;\">" +
                                        "<h2 style=\"color: #333;\">📬 Nouvelle Demande Disponible</h2>" +
                                        "<p>Bonjour <strong>" + prestataire.getNom() + "</strong>,</p>" +
                                        "<p>Une nouvelle demande a été créée pour le service <strong style='color:#007BFF'>" + service.getNomservice() + "</strong>.</p>" +
                                        "<p><strong>Date :</strong> " + demandeDateTime + "<br>" +
                                        "<strong>Client :</strong> " + utilisateur.getNom() + "</p>" +

                                        "<p style='margin-top: 20px;'>Cliquez sur le bouton ci-dessous pour postuler :</p>" +

                                        "<div style=\"text-align: center; margin: 20px 0;\">" +
                                        "<a href=\"http://localhost:4200/login\" style=\"" +
                                        "display: inline-block;" +
                                        "padding: 10px 20px;" +
                                        "background-color: #28a745;" +
                                        "color: white;" +
                                        "text-decoration: none;" +
                                        "border-radius: 5px;" +
                                        "font-weight: bold;" +
                                        "transition: background-color 0.3s ease;\">" +
                                        "Postuler" +
                                        "</a>" +
                                        "</div>" +

                                        "<p>Merci de votre collaboration,<br>L'équipe de la plateforme.</p>" +
                                        "</div>"
                        );
                        String notifMessage = "📢 Nouvelle demande disponible pour le service : " + service.getNomservice();
                        notificationController.sendNotificationToPrestataire(prestataire.getIdUtilisateur(), notifMessage);
                    }
                }



            }
        }








        Map<String, Object> response = new HashMap<>();
        response.put("demande", savedDemande);
        response.put("prestatairesNotifiés", prestatairesFiltres);


        return response;
    }
    private String convertirJourEnAnglais(String jourFrancais) {
        Map<String, String> jours = Map.of(
                "Lundi", "Monday",
                "Mardi", "Tuesday",
                "Mercredi", "Wednesday",
                "Jeudi", "Thursday",
                "Vendredi", "Friday",
                "Samedi", "Saturday",
                "Dimanche", "Sunday"
        );
        return jours.getOrDefault(jourFrancais, jourFrancais);
    }



    private LocalDateTime convertDateToLocalDateTime(Date date) {
        return date.toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime();
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

    public boolean checkEmailExists(String email) {
        return utilisateurRepository.existsByEmail(email);
    }

    @Transactional
    public ResponseEntity<?> updateUser(Long id, Utilisateur utilisateurDetails) {
        Utilisateur user = utilisateurRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur non trouvé !"));


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

                    disponibiliteRepository.save(dispo);
                    user.getDisponibilites().add(dispo);
                }
            }
        }



        Utilisateur updatedUser = utilisateurRepository.save(user);








        String newToken = jwtService.generateToken(updatedUser);
        System.out.println(" Nouveau token généré : " + newToken);


        return ResponseEntity.ok(Map.of(
                "message", "Utilisateur mis à jour avec succès",
                "token", newToken,
                "user", updatedUser
        ));
    }


    public Map<String, Object> affecterAdresse(Long utilisateurId, Long adresseId) {
        Utilisateur utilisateur = utilisateurRepository.findById(utilisateurId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        Adresse adresse = adresseRepository.findById(adresseId)
                .orElseThrow(() -> new RuntimeException("Adresse non trouvée"));

        utilisateur.setAdressee(adresse);
        Utilisateur updatedUser = utilisateurRepository.save(utilisateur);


        String newToken = jwtService.generateToken(updatedUser);



        Map<String, Object> response = new HashMap<>();
        response.put("message", "Adresse affectée avec succès !");
        response.put("token", newToken);
        response.put("user", updatedUser);

        return response;
    }


    public Optional<Utilisateur> getUtilisateurById(Long id) {
        return utilisateurRepository.findById(id);
    }
    public List<Avis> getAvisParUtilisateur(Utilisateur avisUtilisateur) {
        return avisRepository.findByAvisUtilisateur(avisUtilisateur);
    }

    public List<Utilisateur> getUtilisateursEntrepriseOuPrestataireEnAttente() {
        List<UserRole> roles = Arrays.asList(UserRole.ENTREPRISE, UserRole.PRESTATAIRE);
        return utilisateurRepository.findByRoleInAndStatusOrderByCreatedAtAsc(roles, StatusUtilisateur.ATTENTE);
    }
}







