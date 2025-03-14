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

  getAllCategories(): Observable<Categorie[]> {
    return this.http.get<Categorie[]>(`${this.apiUrl}/getAllCategories`);
  }

  createCategorie(formData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, formData);
  }
 
/*
createCategorie(data: any): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}`, data);
}
*/
 
  updateCategorie(id: number, categorie: Categorie): Observable<Categorie> {
    return this.http.put<Categorie>(`${this.apiUrl}/${id}`, categorie);
  }

 
  deleteCategorie(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
