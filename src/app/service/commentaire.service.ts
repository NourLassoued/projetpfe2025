import { Injectable } from '@angular/core';
import { environment } from '../environment';
import { HttpClient } from '@angular/common/http';
import { Commentaire } from 'src/models/Commentaire';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentaireService {
    private readonly apiUrl = `${environment.apiUrl}/commentaires`;
  
  constructor(private readonly  http: HttpClient) {}


  ajouterCommentaire(publicationId: number, utilisateurConnecteId: number, commentaire: Commentaire): Observable<Commentaire> {
    return this.http.post<Commentaire>(`${this.apiUrl}/ajouter/${publicationId}/${utilisateurConnecteId}`, commentaire);
  }


  getCommentairesParPublication(publicationId: number): Observable<Commentaire[]> {
   return this.http.get<Commentaire[]>(`${this.apiUrl}/publication/${publicationId}`);
  }


  getCommentairesParUtilisateur(utilisateurId: number): Observable<Commentaire[]> {
    return this.http.get<Commentaire[]>(`${this.apiUrl}/utilisateur/${utilisateurId}`);
  }
  supprimerCommentaire(id: number) {
    return this.http.delete(`${this.apiUrl}/deletecommaintre/${id}`);
  }

}

