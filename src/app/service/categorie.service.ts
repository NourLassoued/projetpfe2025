import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Categorie } from 'src/models/Categorie';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../environment';
@Injectable({
  providedIn: 'root'
})
export class CategorieService {


  private readonly apiUrl = `${environment.apiUrl}/categories`;

  constructor(private  readonly http: HttpClient) {}

  getAllCategories(): Observable<Categorie[]> {
    return this.http.get<Categorie[]>(`${this.apiUrl}/getAllCategories`);
  }
  searchCategories(nom: string): Observable<Categorie[]> {
    return this.http.get<Categorie[]>(`${this.apiUrl}/search?nom=${nom}`);
  }
  createCategorie(formData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, formData);
  }
 


updateCategorie(id: number, categorie: FormData): Observable<Categorie> {
  return this.http.put<Categorie>(`${this.apiUrl}/${id}`, categorie);
}

 
  deleteCategorie(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
