import { Injectable } from '@angular/core';
import { environment } from '../environment';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = `${environment.apiUrl}/payment`;
  constructor(private http: HttpClient) { }

  createPayment(montant: number, reservationId: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/create/${reservationId}?amount=${montant}`,
      {} 
    );
  }

  createPaymentForReservationEspace(montant: number, reservationId: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/create-payment/${reservationId}?amount=${montant}`,
      {}, 
      {
        responseType: 'text', 
        observe: 'response' 
      }
    );
  }
  

  verifyPayment(paymentId: string): Observable<string> {
    return this.http.get(`${this.apiUrl}/verify/${paymentId}`, { responseType: 'text' });
  }
  getPaymentsByUser(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user/${userId}`);
  }
}
