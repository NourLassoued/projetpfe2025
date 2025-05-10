import { Injectable } from '@angular/core';
import { environment } from '../environment';
import { HttpClient } from '@angular/common/http';
import { Publication } from 'src/models/Publication';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PublicationService {
    private apiUrl = `${environment.apiUrl}/publications`;
  

  constructor(private http: HttpClient) {}


  ajouterPublication(publication: Publication, entrepriseId: number): Observable<Publication> {
    return this.http.post<Publication>(`${this.apiUrl}/entreprise/${entrepriseId}`, publication);
  }

 
  getAllPublications(): Observable<Publication[]> {
    return this.http.get<Publication[]>(`${this.apiUrl}/getAllPublications`);
  }

  getNotifications(userId: number) {
    return this.http.get<any[]>(`${this.apiUrl}/notifications/${userId}`);
  }

  getPublicationsParEntreprise(entrepriseId: number): Observable<Publication[]> {
    return this.http.get<Publication[]>(`${this.apiUrl}/entreprise/${entrepriseId}`);
  }


  supprimerPublication(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
  toggleLike(publicationId: number, particulierId: number): Observable<boolean> {
    return this.http.put<boolean>(`${this.apiUrl}/${publicationId}/like/${particulierId}`, {});
  }


  getNombreDeLikes(publicationId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${publicationId}/likes`);
  }
  utilisateurADejaLike(publicationId: number, utilisateurId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/${publicationId}/like/${utilisateurId}`);
  }
  

}
