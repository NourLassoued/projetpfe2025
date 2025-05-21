import { Injectable } from '@angular/core';
import { environment } from '../environment';
import { Observable } from 'rxjs';
import { Abonnement } from 'src/models/Abonnement ';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AbonmmentserviceService {
  private apiUrl = `${environment.apiUrl}/AbonmentS`;

  constructor(private http: HttpClient) {}
  getAbonnementsActifs(): Observable<Abonnement[]> {
    return this.http.get<Abonnement[]>(`${this.apiUrl}/actifs`);
  }
}
