import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
@Injectable({
  providedIn: 'root'
})
export class FileService {

  private apiUrl = 'http://localhost:8088/nour/api/v1/auth'; // URL de ton backend

  constructor(private http: HttpClient) {}

  uploadFile(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
  
 
    return this.http.post(`${this.apiUrl}/upload`, formData, { responseType: 'text' });
}/*
    uploadFile(file: File): Observable<string> {
      const formData = new FormData();
      formData.append('file', file);
    
      return this.http.post<string>(`${this.apiUrl}/upload`, formData);
    }
    */


  getImage(filename: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/get-image/${filename}`, { responseType: 'blob' });
  }

}
