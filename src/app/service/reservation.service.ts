import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Reservation } from 'src/models/Reservation';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
 private apiUrl = 'http://localhost:8088/nour/reservation';
  constructor(private http: HttpClient) {}
  reserverPrestataire(
    particulierId: number,
    prestataireId: number,
    demandeId: number,
    reservation: Reservation
  ): Observable<Reservation> {
    const url = `${this.apiUrl}/reserver/${particulierId}/${prestataireId}/${demandeId}`;
    return this.http.post<Reservation>(url, reservation);
  }

}
