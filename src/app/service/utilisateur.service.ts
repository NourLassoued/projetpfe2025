import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Avis } from 'src/models/Avis';
import { Demande } from 'src/models/Demande';
import { Reservation } from 'src/models/Reservation';
import { Utilisateur } from 'src/models/Utilisateur';

import { Observable } from 'rxjs/internal/Observable';
import { Postulation } from 'src/models/Postulation';
import { environment } from '../environment';
@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {

   private apiUrl = `${environment.apiUrl}/utilisateurss`;
  constructor(private http: HttpClient) {}


  ajouterUtilisateur(utilisateur: Utilisateur): Observable<Utilisateur> {
    return this.http.post<Utilisateur>(`${this.apiUrl}/ajouter`, utilisateur);
  }
  getAllUsers(): Observable<Utilisateur[]> {
    return this.http.get<Utilisateur[]>(this.apiUrl);
  }
 
    getPrestataires(): Observable<Utilisateur[]> {
      return this.http.get<Utilisateur[]>(`${this.apiUrl}/prestataires`);
    }
    getUtilisateursParticuliers(): Observable<Utilisateur[]> {
      return this.http.get<Utilisateur[]>(`${this.apiUrl}/particuliers`);
    }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteUser/${id}`);
  }
  getAllEntreprises(): Observable<Utilisateur[]> {
    return this.http.get<Utilisateur[]>(`${this.apiUrl}/entreprises`);
  }
  
  updateUser(id: number, utilisateur: Partial<Utilisateur>): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, utilisateur);
  }
  affecterAdresse(utilisateurId: number, adresseId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/affecter-adresse/${utilisateurId}/${adresseId}`, {});
  }
  checkEmailExists(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/email-exists/${email}`);
  }


  creerDemande(emailUtilisateur:String, idService: number, idAdresse:number,demande: Demande): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/creerDemande/${emailUtilisateur}/${idService}/${idAdresse}`, demande);
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

    return this.http.get<string>(`${this.apiUrl}/${email}`);
  }
  getById(id: number): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(`${this.apiUrl}/getById/${id}`);
  }
  postuler(demandeId: number, utilisateurId: number, postulation: Postulation): Observable<Postulation> {
    const url = `${this.apiUrl}/postuler/${demandeId}/${utilisateurId}`;
    return this.http.post<any>(url, postulation);
  }
    getPrestatairesCompatibles(demandeId: number): Observable<Utilisateur[]> {
      return this.http.get<Utilisateur[]>(`${this.apiUrl}/${demandeId}/prestataires-compatibles`);
    }
     getUtilisateursEnAttenteEntrepriseOuPrestataire(): Observable<Utilisateur[]> {
    return this.http.get<Utilisateur[]>(`${this.apiUrl}/en-attente`);
  }
  
}

