import { Injectable } from '@angular/core';
import { environment } from '../environment';
import { Observable } from 'rxjs';
import { Abonnement } from 'src/models/Abonnement ';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AbonmmentserviceService {
  private readonly apiUrl = `${(window as any).apiUrl || environment.apiUrl}/AbonmentS`;

  

  constructor(private readonly http: HttpClient) {}
  getAbonnementsActifs(): Observable<Abonnement[]> {
    return this.http.get<Abonnement[]>(`${this.apiUrl}/actifs`);
  }
  getAbonnementsExprimer(): Observable<Abonnement[]> {
    return this.http.get<Abonnement[]>(`${this.apiUrl}/Exprimer`);
  }
}
