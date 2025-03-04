import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Disponibilite } from 'src/models/Disponibilite';

@Injectable({
  providedIn: 'root'
})
export class DisponibliteService {
  private apiUrl = 'http://localhost:8088/nour/disponibilites'; 

  constructor(private http: HttpClient) {}

 
  ajouterDisponibilite(id: number, disponibilite: Disponibilite): Observable<Disponibilite> {
    console.log("📡 Données envoyées :", disponibilite); 
    return this.http.post<Disponibilite>(`${this.apiUrl}/${id}`, disponibilite);
  }

  modifierDisponibilite(id: number, disponibilite: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, disponibilite);
  }
  supprimerDisponibilite(disponibiliteId: number): Observable<any> {
    return this.http.delete<string>(`${this.apiUrl}/${disponibiliteId}`);
  }  
  getDisponibilitesByPrestataire(prestataireId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${prestataireId}`);
  }
  
}
