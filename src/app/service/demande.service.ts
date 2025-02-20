import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Demande } from 'src/models/Demande';
@Injectable({
  providedIn: 'root'
})
export class DemandeService {

  private apiUrl = 'http://localhost:8088/nour/demandes'; // URL de ton backend

  constructor(private http: HttpClient) {}

  // Supprimer une demande
  deleteDemande(idDemande: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteDemande/${idDemande}`);
  }

  // Mettre à jour une demande
  updateDemande(idDemande: number, demande: Demande): Observable<Demande> {
    return this.http.put<Demande>(`${this.apiUrl}/updateDemande/${idDemande}`, demande);
  }

  // Récupérer toutes les demandes d'un utilisateur
  getAllDemandesByUtilisateurId(idUtilisateur: number): Observable<Demande[]> {
    return this.http.get<Demande[]>(`${this.apiUrl}/getAllDemandesByUtilisateurId/${idUtilisateur}`);
  }

}
