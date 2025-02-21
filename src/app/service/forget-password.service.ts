import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/internal/Observable';
@Injectable({
  providedIn: 'root'
})
export class ForgetPasswordService {
  private apiUrl = 'http://localhost:8088/nour/forgetPassword';
  constructor(private http: HttpClient) {}

  // Vérifier l'email et envoyer l'OTP
  verifyEmail(email: string): Observable<string> {
    return this.http.post(`${this.apiUrl}/verifyMail/${email}`, {}, { responseType: 'text' });
  }

 

  // Changer le mot de passe
  changePassword(email: string, password: string, repeatPassword: string): Observable<string> {
    return this.http.post(`${this.apiUrl}/changePassword/${email}`, { password, repeatPassword }, { responseType: 'text' });
  }
}


