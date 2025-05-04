import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environment';
import { Observable } from 'rxjs';
import { Publication } from 'src/models/Publication';

@Injectable({
  providedIn: 'root'
})
export class NotificationpartuculierServiceService {
   private apiUrl = `${environment.apiUrl}/notification`;

 

  constructor(private http: HttpClient) { }

  markPublicationAsSeen(userId: number, publicationId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/markAsSeen/${userId}/${publicationId}`, {});
  }

 
  getUnseenPublications(userId: number): Observable<Publication[]> {
    return this.http.get<Publication[]>(`${this.apiUrl}/unseenPublications/${userId}`);
  }
}
