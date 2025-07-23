import { Injectable } from '@angular/core';
import { environment } from '../environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatbotServiceService {
  //private readonly apiUrl = `${environment.apiUrl}/chatbot/chat`;
  private readonly apiUrl = `${(window as any).apiUrl || environment.apiUrl}/chatbot/chat`;



 constructor(private readonly  http: HttpClient) {}

sendMessage(message: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { message });
  }

}
