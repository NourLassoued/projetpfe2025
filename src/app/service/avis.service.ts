import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthServiceService } from './auth-service.service';
import { Observable } from 'rxjs';
import { Avis } from 'src/models/Avis';

@Injectable({
  providedIn: 'root'
})
export class AvisService {

 private apiUrl = 'http://localhost:8088/nour/avis'; 

  constructor(private http: HttpClient,private auth:AuthServiceService) {}
  getAvisParUtilisateur(id: number): Observable<Avis[]> {
    return this.http.get<Avis[]>(`${this.apiUrl}/parparticulier/${id}`);
  }
  deleteAvis(idAvis: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/avis/${idAvis}`);
  }
  updateAvis(idAvis: number, updatedAvis: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/avis/${idAvis}`, updatedAvis);
  }
  getAvisParprestatitr(idUtilisateur: number): Observable<Avis[]> {
    return this.http.get<Avis[]>(`${this.apiUrl}/utilisateur/${idUtilisateur}`);
  }
  
  getScoreMoyen(utilisateurId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/score/${utilisateurId}`);
  }
  getNombreAvisPourUtilisateur(idUtilisateur: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count/${idUtilisateur}`);
  }
  
}
