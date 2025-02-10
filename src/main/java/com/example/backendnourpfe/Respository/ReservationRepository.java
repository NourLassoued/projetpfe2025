package com.example.backendnourpfe.Respository;

import com.example.backendnourpfe.classes.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservationRepository extends JpaRepository<Reservation,Long> {
}
