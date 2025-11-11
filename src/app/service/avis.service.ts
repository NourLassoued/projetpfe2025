import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Avis } from 'src/models/Avis';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class AvisService {


private  readonly apiUrl = `${(window as any).apiUrl || environment.apiUrl}/avis`;
  constructor(private  readonly http: HttpClient) {}
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
  
  getTopAvisByUtilisateur(): Observable<Avis[]> {
    return this.http.get<Avis[]>(`${this.apiUrl}/best-by-user`);
  }
  getAllAvis(): Observable<Avis[]> {
    return this.http.get<Avis[]>(`${this.apiUrl}/getAllAvis`);
  }
  getScoresMoyens(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/scores-moyens`);
  }
  
}
