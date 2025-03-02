import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, switchMap, throwError } from 'rxjs';
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
  modifierDisponibilite(disponibiliteId: number, disponibilite: Disponibilite): Observable<Disponibilite> {
    let token = localStorage.getItem('token');
  
    console.log("📌 Token actuel :", token); // 🔹 Vérification du token
  
    if (!token) {
      console.error("⚠️ Aucun token trouvé !");
      return throwError(() => new Error("Utilisateur non authentifié"));
    }
  
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  
    return this.http.put<Disponibilite>(`${this.apiUrl}/modifier/${disponibiliteId}`, disponibilite, { headers }).pipe(
      catchError(err => {
        console.error("⚠️ Erreur lors de la requête :", err);
        return throwError(() => err);
      })
    );
  }
  
  
  // 🔹 Fonction pour rafraîchir le token
  refreshToken(): Observable<string> {
    const oldToken = localStorage.getItem('token');
    return this.http.post<{ token: string }>(`${this.apiUrl}/refresh-token`, {}, {
      headers: new HttpHeaders({ 'Authorization': `Bearer ${oldToken}` })
    }).pipe(
      map(response => response.token)
    );
  }
} 