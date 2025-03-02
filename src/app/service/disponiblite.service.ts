import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Disponibilite } from 'src/models/Disponibilite';

@Injectable({
  providedIn: 'root'
})
export class DisponibliteService {
  private apiUrl = 'http://localhost:8088/nour/disponibilites'; // URL du backend

  constructor(private http: HttpClient) {}

  // ✅ Ajouter une disponibilité
  ajouterDisponibilite(utilisateurId: number, disponibilite: Disponibilite): Observable<Disponibilite> {
    return this.http.post<Disponibilite>(`${this.apiUrl}/ajouter/${utilisateurId}`, disponibilite);
  }

  modifierDisponibilite(id: number, disponibilite: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, disponibilite);
  }
  

}
