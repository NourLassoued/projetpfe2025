package com.example.backendnourpfe.controlleur;

import com.example.backendnourpfe.classes.Reservation;

import com.example.backendnourpfe.service.ReservationService;
import jakarta.mail.MessagingException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/reservation")
public class ReservationController {
    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }


    @PostMapping("/reserver/{particulierId}/{prestataireId}/{demandeId}")
    public ResponseEntity<Reservation> reserverPrestataire(
            @PathVariable Long particulierId,
            @PathVariable Long prestataireId,
            @PathVariable Long demandeId,
            @RequestBody Reservation reservation) throws MessagingException {


        Reservation reservationSauvegardee = reservationService.creerReservation(particulierId, prestataireId, demandeId, reservation);


        return ResponseEntity.ok(reservationSauvegardee);
    }

    @GetMapping("/confirmer/{idReservation}")
    public void confirmerReservation(@PathVariable Long idReservation, HttpServletResponse response) {
        try {
            reservationService.confirmerReservation(idReservation);
            response.sendRedirect("http://localhost:4200/login");
        } catch (Exception e) {
            try {
                response.sendRedirect("http://localhost:4200/error");
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        }
    }
    @PostMapping("/refuser/{reservationId}")
    public ResponseEntity<String> refuserReservation(@PathVariable Long reservationId) {
        reservationService.refuserReservation(reservationId);
        return ResponseEntity.ok("Réservation refusée");
    }
    @GetMapping("/byDemande/{idDemande}")
    public List<Reservation> getReservationsByDemandeId(@PathVariable Long idDemande) {
        return reservationService.getReservationsByDemandeId(idDemande);
    }
    @DeleteMapping("/annuler/{reservationId}/{utilisateurId}")
    public ResponseEntity<Void> annulerReservation(
            @PathVariable Long reservationId,
            @PathVariable Long utilisateurId) {
        try {
            reservationService.annulerReservation(reservationId, utilisateurId);
            return ResponseEntity.ok().build();
        } catch (EntityNotFoundException e) {

            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest().build();
        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    @PutMapping("/terminer/{reservationId}")
    public ResponseEntity<Void> terminerReservation(@PathVariable Long reservationId) {
        try {
            reservationService.terminerReservation(reservationId);
            return ResponseEntity.ok().build();
        } catch (EntityNotFoundException e) {

            return ResponseEntity.notFound().build();
        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    @GetMapping("/attente/{idParticulier}")
    public ResponseEntity<List<Reservation>> getReservationsEnAttenteParParticulier(@PathVariable Long idParticulier) {
        List<Reservation> reservations = reservationService.getReservationsEnAttenteParParticulier(idParticulier);
        return ResponseEntity.ok(reservations);
    }
    @GetMapping("/terminees/particulier/{id}")
    public ResponseEntity<List<Reservation>> getReservationsTermineesByParticulier(@PathVariable Long id) {
        List<Reservation> reservations = reservationService.getReservationsTermineesByParticulier(id);
        return ResponseEntity.ok(reservations);
    }
    @GetMapping("/prestataire/{prestataireId}/reservations/confirmées")
    public List<Reservation> getReservationsConfirmées(@PathVariable Long prestataireId) {
        return reservationService.getReservationsByPrestataireAndStatus(prestataireId);
    }
    @GetMapping("/all")
    public List<Reservation> getAllReservations() {
        return reservationService.getAllReservations();
    }
}

