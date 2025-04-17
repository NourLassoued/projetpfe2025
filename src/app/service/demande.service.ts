import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Demande } from 'src/models/Demande';
import { AuthServiceService } from './auth-service.service';
import { Postulation } from 'src/models/Postulation';
import { environment } from '../environment';
@Injectable({
  providedIn: 'root'
})
export class DemandeService {

 // private apiUrl = 'http://localhost:8088/nour/demandes'; 
    private apiUrl = `${environment.apiUrl}/demandes`;

  constructor(private http: HttpClient,private auth:AuthServiceService) {}


  deleteDemande(idDemande: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteDemande/${idDemande}`);
  }

  getDemandeById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
  updateDemande(id: number, demandeDetails: any): Observable<any> {
    const url = `${this.apiUrl}/updateDemande/${id}`;
    return this.http.put(url, demandeDetails, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    });
  }
  getDemandesDisponibles(utilisateurId: number): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/utilisateur/${utilisateurId}`);
  }

  
  getDemandesByUtilisateurDateBefore(id: number): Observable<Demande[]> {
    return this.http.get<Demande[]>(`${this.apiUrl}/${id}/datebefore`);
  }
  
 
  getAllDemandesByUtilisateurId(idUtilisateur: number): Observable<Demande[]> {
    return this.http.get<Demande[]>(`${this.apiUrl}/getAllDemandesByUtilisateurId/${idUtilisateur}`);
  }
  getPostulationsByDemande(idDemande: number): Observable<Postulation[]> {
    return this.http.get<Postulation[]>(`${this.apiUrl}/${idDemande}/postulations`);
  }
  getDemandesTermineesByUserId(idUtilisateur: number): Observable<Demande[]> {
    return this.http.get<Demande[]>(`${this.apiUrl}/${idUtilisateur}/demandestermines`);
  }
  getPostulationsByPrestataire(idPrestataire: number): Observable<Postulation[]> {
    return this.http.get<Postulation[]>(`${this.apiUrl}/${idPrestataire}/postulationsutlisateure`);
  
  }
  updatePostulation(id: number, postulation: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/updatePostulation/${id}`, postulation);
  
  }

  deletePostulation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
