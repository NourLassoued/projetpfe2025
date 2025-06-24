package com.example.backendnourpfe.service;

import com.example.backendnourpfe.respository.DemandeRepository;
import com.example.backendnourpfe.respository.PostulationRepository;
import com.example.backendnourpfe.respository.UtilisateurRepository;
import com.example.backendnourpfe.classes.*;
import com.example.backendnourpfe.interfacee.DemandeInterface;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;

import java.util.*;
import java.util.stream.Collectors;
@RequiredArgsConstructor
@Service
public class DemandeService implements DemandeInterface {
    private final DemandeRepository demandeRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final PostulationRepository postulationRepository;
    private final AvisService avisService;


    @Override
    public void deleteDemande(Long idDemande) {
        Demande demande = demandeRepository.findById(idDemande)
                .orElseThrow(() -> new RuntimeException("Demande non trouvée"));
        demandeRepository.delete(demande);
    }

    @Override
    public Demande updateDemande(Long id, Demande demandeDetails) {

        Demande demande = demandeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Demande non trouvée"));


        if (demandeDetails.getDescription() != null && !demandeDetails.getDescription().isEmpty()) {
            demande.setDescription(demandeDetails.getDescription());
        }
        if (demandeDetails.getTelephoneNumber() != null) {
            demande.setTelephoneNumber(demandeDetails.getTelephoneNumber());
        }
        if (demandeDetails.getTitle() != null && !demandeDetails.getTitle().isEmpty()) {
            demande.setTitle(demandeDetails.getTitle());
        }
        if (demandeDetails.getHeureTravail() != null) {
            demande.setHeureTravail(demandeDetails.getHeureTravail());
        }
        if (demandeDetails.getDate() != null) {
            demande.setDate(demandeDetails.getDate());
        }


        return demandeRepository.save(demande);
    }

    @Override
    public List<Demande> getAllDemandesByUtilisateurId(Long idUtilisateur) {
        Utilisateur utilisateur = utilisateurRepository.findById(idUtilisateur)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvéeee"));

        Date today = new Date();

        return demandeRepository.findByUtilisateurAndStatusDemandeAndDateAfter(utilisateur, StatusDemande.EN_COURS, today);
    }

    @Override
    public List<Demande> getAllDemandesByUtilisateurIddDateBefore(Long idUtilisateur) {
        Utilisateur utilisateur = utilisateurRepository.findById(idUtilisateur)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé getAllDemandesByUtilisateurIddDateBefore("));

        Date today = new Date();

        return demandeRepository.findTermineesAvecReservationConforme(
                utilisateur,
                StatusDemande.TERMINE,
                today,
                StatusReservation.CONFORME
        );
    }
    @Override
    public List<Demande> getAllDemandesByUtilisateurIdTerminees(Long idUtilisateur) {
        Utilisateur utilisateur = utilisateurRepository.findById(idUtilisateur)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvee etAllDemandesByUtilisateurIdTerminees("));

        Date today = new Date();

        return demandeRepository.findTermineesAvecReservationConforme(
                utilisateur,
                StatusDemande.TERMINE,
                today,
                StatusReservation.CONFORME
        );

    }




    public List<Demande> getAvailableDemandesForUtilisateur(Long utilisateurId) {

        Utilisateur utilisateur = utilisateurRepository.findById(utilisateurId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));


        Long adresseId = utilisateur.getAdressee().getIdAdresse();
        List<Servicee> servicesOfferts = utilisateur.getServicesOfferts();
        List<Long> serviceIds = servicesOfferts.stream()
                .map(Servicee::getIdservice)
                .collect(Collectors.toList());
        List<Disponibilite> disponibilites = utilisateur.getDisponibilites();


        List<Demande> demandesDisponibles = new ArrayList<>();

        for (Disponibilite dispo : disponibilites) {
            String jourDemande = convertirJourEnAnglais(dispo.getJour());
            LocalTime heureDebut = dispo.getHeureDebut();
            LocalTime heureFin = dispo.getHeureFin();



            List<Demande> demandesExistantes = demandeRepository.findAllByAdresseAndJourAndService(
                    adresseId, jourDemande, serviceIds);

            for (Demande demande : demandesExistantes) {
                LocalDateTime demandeDate = convertDateToLocalDateTime(demande.getDate());
                LocalTime heureDemandeExistante = demandeDate.toLocalTime();


                boolean dejaPostule = postulationRepository.existsByDemandeAndPrestataire(demande, utilisateur);

                if (!dejaPostule &&
                        !utilisateur.getDemandesDejaPostulees().contains(demande.getIdDemande()) &&
                        !heureDemandeExistante.isBefore(heureDebut) &&
                        !heureDemandeExistante.isAfter(heureFin)) {

                    demandesDisponibles.add(demande);
                }

            }
        }
        return demandesDisponibles;
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
    public Optional<Demande> getDemandeById(Long id) {
        return demandeRepository.findById(id);
    }

    public List<Utilisateur> getAvailablePrestatairesForDemande(Long demandeId) {
        Demande demande = demandeRepository.findById(demandeId)
                .orElseThrow(() -> new RuntimeException("Demande non trouvée"));

        Long adresseId = demande.getAdressedemande().getIdAdresse();
        Long serviceId = demande.getServicee().getIdservice();
        String jourDemande = convertirJourEnAnglais(
                convertDateToLocalDateTime(demande.getDate()).getDayOfWeek().name()
        );
        LocalTime heureDemande = convertDateToLocalDateTime(demande.getDate()).toLocalTime();

        List<Utilisateur> prestatairesPotentiels = demandeRepository.findByServiceAndAdresse(serviceId, adresseId);
        List<Utilisateur> prestatairesCompatibles = new ArrayList<>();

        for (Utilisateur prestataire : prestatairesPotentiels) {


            for (Disponibilite dispo : prestataire.getDisponibilites()) {
                String jourDispo = convertirJourEnAnglais(dispo.getJour());
                if (!jourDispo.equalsIgnoreCase(jourDemande)) continue;

                if (!heureDemande.isBefore(dispo.getHeureDebut()) &&
                        !heureDemande.isAfter(dispo.getHeureFin())) {
                    prestatairesCompatibles.add(prestataire);
                    break;
                }
            }
        }


        prestatairesCompatibles.sort((u1, u2) -> {
            double score1 = avisService.calculerScoreMoyen(u1.getIdUtilisateur());
            double score2 = avisService.calculerScoreMoyen(u2.getIdUtilisateur());
            return Double.compare(score2, score1);
        });
        return prestatairesCompatibles;
    }

}