import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Categorie } from 'src/models/Categorie';
import { Observable } from 'rxjs/internal/Observable';
@Injectable({
  providedIn: 'root'
})
export class CategorieService {

  private apiUrl = 'http://localhost:8088/nour/categories'; // URL de ton backend

  constructor(private http: HttpClient) {}

  // Récupérer toutes les catégories
  getAllCategories(): Observable<Categorie[]> {
    return this.http.get<Categorie[]>(`${this.apiUrl}/getAllCategories`);
  }

  // Créer une catégorie
  createCategorie(categorie: Categorie): Observable<Categorie> {
    return this.http.post<Categorie>(`${this.apiUrl}/createCategorie`, categorie);
  }

  // Mettre à jour une catégorie
  updateCategorie(id: number, categorie: Categorie): Observable<Categorie> {
    return this.http.put<Categorie>(`${this.apiUrl}/${id}`, categorie);
  }

  // Supprimer une catégorie
  deleteCategorie(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
