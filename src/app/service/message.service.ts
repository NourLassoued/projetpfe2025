import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from 'src/models/Message';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private apiUrl = 'http://localhost:8088/nour/message'; 

  constructor(private http: HttpClient) {}

  
  sendMessage(message: Message): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/send`, message);
  }

  
  markAsRead(messageId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/mark-as-read/${messageId}`, {});
  }


  getUndeliveredMessages(receiverId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/undelivered/${receiverId}`);
  }


  getConversation(senderId: number, receiverId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/conversation/${senderId}/${receiverId}`);
  }
  getLastMessagesByUser(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/last/${userId}`);
  }

}
