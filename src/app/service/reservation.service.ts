import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Reservation } from 'src/models/Reservation';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

 // private  readonly apiUrl = `${environment.apiUrl}/reservation`;
  private readonly apiUrl = `${(window as any).apiUrl || environment.apiUrl}/reservation`;
 

  constructor(private  readonly http: HttpClient) {}
  reserverPrestataire(
    particulierId: number,
    prestataireId: number,
    demandeId: number,
    reservation: Reservation
  ): Observable<Reservation> {
    const url = `${this.apiUrl}/reserver/${particulierId}/${prestataireId}/${demandeId}`;
    return this.http.post<Reservation>(url, reservation);
  }

  
  getReservationsByDemandeId(idDemande: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/byDemande/${idDemande}`);
  }
  annulerReservation(reservationId: number, utilisateurId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/annuler/${reservationId}/${utilisateurId}`);
  }
  terminerReservation(idReservation: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/terminer/${idReservation}`, {});
  }
  getReservationsEnAttenteParParticulier(idParticulier: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/attente/${idParticulier}`);
  }
  getReservationsTermineesByParticulier(id: number): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/terminees/particulier/${id}`);
  }
  getReservationsConfirmées(prestataireId: number): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/prestataire/${prestataireId}/reservations/confirmées`);
  }
  getAllReservations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`);
  }

}
