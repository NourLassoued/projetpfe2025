import { Injectable } from '@angular/core';
import { environment } from '../environment';
import { HttpClient } from '@angular/common/http';
import { Commentaire } from 'src/models/Commentaire';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentaireService {
    private apiUrl = `${environment.apiUrl}/commentaires`;
  
  constructor(private http: HttpClient) {}


  ajouterCommentaire(publicationId: number, utilisateurId: number, commentaire: Commentaire): Observable<Commentaire> {
    return this.http.post<Commentaire>(`${this.apiUrl}/ajouter/${publicationId}/${utilisateurId}`, commentaire);
  }


  getCommentairesParPublication(publicationId: number): Observable<Commentaire[]> {
   return this.http.get<Commentaire[]>(`${this.apiUrl}/publication/${publicationId}`);
  }


  getCommentairesParUtilisateur(utilisateurId: number): Observable<Commentaire[]> {
    return this.http.get<Commentaire[]>(`${this.apiUrl}/utilisateur/${utilisateurId}`);
  }
}

