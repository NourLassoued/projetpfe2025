import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Servicee } from 'src/models/Servicee';
import { Observable } from 'rxjs/internal/Observable';
import { Utilisateur } from 'src/models/Utilisateur';
@Injectable({
  providedIn: 'root'
})
export class ServiceeService {

  private apiUrl = 'http://localhost:8088/nour/services'; // Remplace par l'URL de ton backend

  constructor(private http: HttpClient) {}


  getAllServices(): Observable<Servicee[]> {
    return this.http.get<Servicee[]>(`${this.apiUrl}`);
  }


  createService(service: Servicee): Observable<Servicee> {
    return this.http.post<Servicee>(`${this.apiUrl}`, service);
  }


  updateService(id: number, service: Servicee): Observable<Servicee> {
    return this.http.put<Servicee>(`${this.apiUrl}/${id}`, service);
  }

  deleteService(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  addServiceToCategory(categorieId: number, service: Servicee): Observable<Servicee> {
    return this.http.post<Servicee>(`${this.apiUrl}/${categorieId}/addService`, service);
  }


  getUtilisateursByServiceOrderedByRating(serviceId: number): Observable<Utilisateur[]> {
    return this.http.get<Utilisateur[]>(`${this.apiUrl}/par-service/${serviceId}/sorted-by-rating`);
  }


  getAllServicesByCategorie(categorieId: number): Observable<Servicee[]> {
    return this.http.get<Servicee[]>(`${this.apiUrl}/categorie/${categorieId}`);
  }

  getUtilisateursByService(serviceId: number): Observable<Utilisateur[]> {
    return this.http.get<Utilisateur[]>(`${this.apiUrl}/par-service/${serviceId}`);
  }
}
