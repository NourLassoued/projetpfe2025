import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Demande } from 'src/models/Demande';
import { AuthServiceService } from './auth-service.service';
@Injectable({
  providedIn: 'root'
})
export class DemandeService {

  private apiUrl = 'http://localhost:8088/nour/demandes'; 

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

  

  
 
  getAllDemandesByUtilisateurId(idUtilisateur: number): Observable<Demande[]> {
    return this.http.get<Demande[]>(`${this.apiUrl}/getAllDemandesByUtilisateurId/${idUtilisateur}`);
  }

}
