import { Injectable } from '@angular/core';
import { environment } from '../environment';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TypeAbonnement } from 'src/models/TypeAbonnement';

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
 payerAbonnement(email: string, type: string) {
    const params = new HttpParams()
      .set('email', email)
      .set('type', type);

    return this.http.post(this.apiUrl + '/abonnement', null, {
      params,
      responseType: 'text' 
    });
  }

 
  verifyAbonnementPayment(paymentId: string): Observable<string> {
    return this.http.get(`${this.apiUrl}/verify-abonnement/${paymentId}`, { responseType: 'text' });
  }


  testEnvoyerEmailBienvenue(email: string): Observable<string> {
    const params = new HttpParams().set('email', email);
    return this.http.get(`${this.apiUrl}/test-email-bienvenue`, { params, responseType: 'text' });
  }
  activerGratuit(email: string) {


     const params = new HttpParams()
      .set('email', email)
    

    return this.http.post(this.apiUrl + '/abonnement/gratuit', null, {
      params,
      responseType: 'text' 
    });
  }
   aDejaUtiliseGratuit(email: string): Observable<boolean> {
    const params = new HttpParams().set('email', email);
    return this.http.get<boolean>(`${this.apiUrl}/a-deja-utilise-gratuit`, { params });
  }
}