import { Injectable } from '@angular/core';
import { AuthServiceService } from './auth-service.service';
import { HttpClient } from '@angular/common/http';
import { Postulation } from 'src/models/Postulation';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostulationService {
 private apiUrl = 'http://localhost:8088/nour/postulations'; 

  constructor(private http: HttpClient,private auth:AuthServiceService) {}
  getPostulationsByPrestataire(idPrestataire: number): Observable<Postulation[]> {
    return this.http.get<Postulation[]>(`${this.apiUrl}/prestataire/${idPrestataire}`);
  }
  
}
