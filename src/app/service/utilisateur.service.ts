import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Avis } from 'src/models/Avis';
import { Demande } from 'src/models/Demande';
import { Reservation } from 'src/models/Reservation';
import { Utilisateur } from 'src/models/Utilisateur';

import { Observable } from 'rxjs/internal/Observable';
@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {
  private apiUrl = 'http://localhost:8088/nour/api/utilisateurss'; // URL de ton backend
  constructor(private http: HttpClient) {}

  // Ajouter un utilisateur
  ajouterUtilisateur(utilisateur: Utilisateur): Observable<Utilisateur> {
    return this.http.post<Utilisateur>(`${this.apiUrl}/ajouter`, utilisateur);
  }

  // Supprimer un utilisateur
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteUser/${id}`);
  }

  // Mettre à jour un utilisateur
  updateProfil(id: number, utilisateur: Utilisateur): Observable<Utilisateur> {
    return this.http.put<Utilisateur>(`${this.apiUrl}/updateProfil/${id}`, utilisateur);
  }

  // Créer une demande
  creerDemande(idUtilisateur: number, idService: number, demande: Demande): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/creerDemande/${idUtilisateur}/${idService}`, demande);
  }

  // Ajouter un avis
  donnerAvis(idUtilisateur: number, idAvisUtilisateur: number, avis: Avis): Observable<Avis> {
    return this.http.post<Avis>(`${this.apiUrl}/${idUtilisateur}/avis/${idAvisUtilisateur}`, avis);
  }

  // Récupérer les avis d'un utilisateur
  getAvisByAvisUtilisateur(idAvisUtilisateur: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/utilisateur/${idAvisUtilisateur}`);
  }

  // Créer une réservation
  creerReservation(idParticulier: number, idPrestataire: number, reservation: Reservation): Observable<Reservation> {
    return this.http.post<Reservation>(`${this.apiUrl}/creerReservation/${idParticulier}/${idPrestataire}`, reservation);
  }

  // Activer un compte utilisateur
  activateAccount(email: string): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/activation/${email}`);
  }
}

