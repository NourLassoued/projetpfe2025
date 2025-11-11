import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Adresse } from 'src/models/Adresse';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class AdresseService {
    private readonly apiUrl = `${(window as any).apiUrl || environment.apiUrl}/adresses`;




  constructor(private  readonly http: HttpClient) {}


  getAllAdresses(): Observable<Adresse[]> {
    return this.http.get<Adresse[]>(this.apiUrl);
  }


  getAdresseById(id: number): Observable<Adresse> {
    return this.http.get<Adresse>(`${this.apiUrl}/${id}`);
  }


  addAdresse(adresse: Adresse): Observable<Adresse> {
    return this.http.post<Adresse>(this.apiUrl, adresse);
  }

  
  updateAdresse(id: number, adresse: Adresse): Observable<Adresse> {
    return this.http.put<Adresse>(`${this.apiUrl}/${id}`, adresse);
  }


  deleteAdresse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
