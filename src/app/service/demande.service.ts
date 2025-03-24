import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Demande } from 'src/models/Demande';
@Injectable({
  providedIn: 'root'
})
export class DemandeService {

  private apiUrl = 'http://localhost:8088/nour/demandes'; 

  constructor(private http: HttpClient) {}


  deleteDemande(idDemande: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteDemande/${idDemande}`);
  }


  updateDemande(idDemande: number, demande: Demande): Observable<Demande> {
    return this.http.put<Demande>(`${this.apiUrl}/updateDemande/${idDemande}`, demande);
  }

 
  getAllDemandesByUtilisateurId(idUtilisateur: number): Observable<Demande[]> {
    return this.http.get<Demande[]>(`${this.apiUrl}/getAllDemandesByUtilisateurId/${idUtilisateur}`);
  }

}
