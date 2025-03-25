import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Demande } from 'src/models/Demande';
import { AuthServiceService } from './auth-service.service';
import { throwError } from 'rxjs';
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
  updateDemande(id: number, demandeDetails: Demande): Observable<Demande> {
    const token = this.auth.getAccessToken(); // Récupérer le token
    if (!token) {
      console.error('Aucun token trouvé, utilisateur non authentifié.');
      alert('Vous devez être connecté pour effectuer cette action.');
      return throwError(() => new Error('Utilisateur non authentifié'));
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  
    return this.http.put<Demande>(`${this.apiUrl}/${id}`, demandeDetails, { headers });
  }
  


  
 
  getAllDemandesByUtilisateurId(idUtilisateur: number): Observable<Demande[]> {
    return this.http.get<Demande[]>(`${this.apiUrl}/getAllDemandesByUtilisateurId/${idUtilisateur}`);
  }

}
