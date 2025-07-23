import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Disponibilite } from 'src/models/Disponibilite';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class DisponibliteService {
 // private readonly  apiUrl = `${environment.apiUrl}/disponibilites`;
  private readonly apiUrl = `${(window as any).apiUrl || environment.apiUrl}/disponibilites`;

  constructor(private readonly http: HttpClient) {}

 
  ajouterDisponibilite(id: number, disponibilite: Disponibilite): Observable<Disponibilite> {
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
