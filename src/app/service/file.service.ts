import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../environment';
@Injectable({
  providedIn: 'root'
})
export class FileService {

  private profileImageSubject = new BehaviorSubject<string | null>(null);
  profileImage$ = this.profileImageSubject.asObservable();
  //private apiUrl = 'http://localhost:8088/nour/api/v1/auth'; 
   private apiUrl = `${environment.apiUrl}/api/v1/auth`;


  constructor(private http: HttpClient) {}

  uploadFile(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
  
 
    return this.http.post(`${this.apiUrl}/upload`, formData, { responseType: 'text' });
  }

  getImage(filename: string): Observable<Blob> {
    const url = `${this.apiUrl}/get-image/${encodeURIComponent(filename)}`;
    return this.http.get(url, { responseType: 'blob' });
  }
/*

  getImage(filename: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/get-image/${filename}`, { responseType: 'blob' });
  }*/
  updateProfileImage(newImageUrl: string) {
    this.profileImageSubject.next(newImageUrl);
  }

}
