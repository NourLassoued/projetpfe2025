import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../environment';
@Injectable({
  providedIn: 'root'
})
export class ForgetPasswordService {
   private  readonly apiUrl = `${environment.apiUrl}/forgetPassword`;
  
  constructor(private readonly  http: HttpClient) {}

 
  verifyEmail(email: string): Observable<string> {
    return this.http.post(`${this.apiUrl}/verifyMail/${email}`, {}, { responseType: 'text' });
  }

 


  changePassword(id: Number, password: string, repeatPassword: string): Observable<string> {
    return this.http.post(`${this.apiUrl}/changePassword/${id}`, { password, repeatPassword }, { responseType: 'text' });
  }
}


