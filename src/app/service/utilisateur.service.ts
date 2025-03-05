import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  private apiUrl = 'http://localhost:8088/nour/utilisateurss'; 
  constructor(private http: HttpClient) {}


  ajouterUtilisateur(utilisateur: Utilisateur): Observable<Utilisateur> {
    return this.http.post<Utilisateur>(`${this.apiUrl}/ajouter`, utilisateur);
  }


  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteUser/${id}`);
  }

  /*
  updateUser(id: number, utilisateur: Utilisateur): Observable<Utilisateur> {
    return this.http.put<Utilisateur>(`${this.apiUrl}/${id}`, utilisateur);
  }*/
  updateUser(id: number, utilisateur: Partial<Utilisateur>): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, utilisateur);
  }
  affecterAdresse(utilisateurId: number, adresseId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/affecter-adresse/${utilisateurId}/${adresseId}`, {});
  }


  creerDemande(idUtilisateur: number, idService: number, demande: Demande): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/creerDemande/${idUtilisateur}/${idService}`, demande);
  }


  donnerAvis(idUtilisateur: number, idAvisUtilisateur: number, avis: Avis): Observable<Avis> {
    return this.http.post<Avis>(`${this.apiUrl}/${idUtilisateur}/avis/${idAvisUtilisateur}`, avis);
  }


  getAvisByAvisUtilisateur(idAvisUtilisateur: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/utilisateur/${idAvisUtilisateur}`);
  }


  creerReservation(idParticulier: number, idPrestataire: number, reservation: Reservation): Observable<Reservation> {
    return this.http.post<Reservation>(`${this.apiUrl}/creerReservation/${idParticulier}/${idPrestataire}`, reservation);
  }


  activateAccount(email: string): Observable<string> {

    return this.http.get<string>(`${this.apiUrl}/activation/${email}`);
  }
  getById(id: number): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(`${this.apiUrl}/getById/${id}`);
  }
}

