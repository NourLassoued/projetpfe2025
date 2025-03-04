import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/internal/Observable';
@Injectable({
  providedIn: 'root'
})
export class ForgetPasswordService {
  private apiUrl = 'http://localhost:8088/nour/forgetPassword';
  constructor(private http: HttpClient) {}

 
  verifyEmail(email: string): Observable<string> {
    return this.http.post(`${this.apiUrl}/verifyMail/${email}`, {}, { responseType: 'text' });
  }

 


  changePassword(id: Number, password: string, repeatPassword: string): Observable<string> {
    return this.http.post(`${this.apiUrl}/changePassword/${id}`, { password, repeatPassword }, { responseType: 'text' });
  }
}


