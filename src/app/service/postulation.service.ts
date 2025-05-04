import { Injectable } from '@angular/core';
import { AuthServiceService } from './auth-service.service';
import { HttpClient } from '@angular/common/http';
import { Postulation } from 'src/models/Postulation';
import { Observable } from 'rxjs';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class PostulationService {

 private apiUrl = `${environment.apiUrl}/postulations`;

  constructor(private http: HttpClient,private auth:AuthServiceService) {}
  /*
  getPostulationsByPrestataire(idPrestataire: number): Observable<Postulation[]> {
    return this.http.get<Postulation[]>(`${this.apiUrl}/${idPrestataire}`);
  }*/
  
}
