import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from 'src/models/Message';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  [x: string]: any;
 
  private readonly apiUrl = `${(window as any).apiUrl || environment.apiUrl}/message`;

  constructor(private  readonly http: HttpClient) {}

  
  sendMessage(message: Message): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/send`, message);
  }

  
  markAsRead(id: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/mark-as-read/${id}`, {});
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
