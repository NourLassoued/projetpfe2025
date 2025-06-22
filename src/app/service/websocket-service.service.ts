
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { Client, IMessage } from '@stomp/stompjs';  // Utilise @stomp/stompjs

import { AuthServiceService } from './auth-service.service';
import { jwtDecode } from 'jwt-decode';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class WebsocketServiceService {  
  private client!: Client;  
  private  readonly notificationsSubject: Subject<string> = new Subject();
  private readonly messagesSubject: Subject<IMessage> = new Subject(); 
  private userRole: string | null = null; 
  
  user: any = null;

  private connected: boolean = false;

  constructor(private readonly authServiceService: AuthServiceService,
    private readonly http: HttpClient
  ) {
  
  }

  connect(userId: number, role: string): void {
    this.connected = true;

    const token = localStorage.getItem('accessToken');
  
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        this.user = decodedToken;
        userId = this.user.id;  
      } catch (error) {
        console.error('Erreur lors du décodage du token:', error);
      }
    }
  
    this.userRole = this.authServiceService.getUserRole();
    this.user = this.authServiceService.getCurrentUser();
  
 
  
    this.client = new Client({
      brokerURL: 'ws://localhost:8088/nour/ws/websocket',
      connectHeaders: {},
      reconnectDelay: 5000,
      onConnect: () => {
        this.client.subscribe(`/topic/notifications/${userId}`, (message: IMessage) => {
          this.notificationsSubject.next(message.body);
        });
  
        // 2️Récupération des anciennes notifications
        this.http.get<string[]>(`http://localhost:8088/nour/notifications/${userId}`)
       
          .subscribe(oldMessages => {
          if (Array.isArray(oldMessages)) {
            oldMessages.forEach(msg => this.notificationsSubject.next(msg));
          }
          });

          this.client.subscribe(`/topic/messages/${userId}`, (message: IMessage) => {
            // Envoi du message reçu au sujet messagesSubject
            this.messagesSubject.next(message);
          });
          
        },
      
      onStompError: (frame) => {
        console.error('Erreur STOMP:', frame);
      }
    });
  
    this.client.activate();
  }
  
  getNotifications(): Observable<string> {
    return this.notificationsSubject.asObservable();
  }
  getMessages(): Observable<IMessage> {
    return this.messagesSubject.asObservable();
  }

  
  disconnect(): void {
    if (this.client?.connected) {
      this.client.deactivate(); // Arrêter la connexion
     
    }
  }
  
  sendMessagetempsreel(message: any): void {
    if (this.client && this.connected) {
      this.client.publish({
        destination: '/app/chat',
        body: JSON.stringify(message)
      });
    } else {
      console.error('STOMP client not connected!');
    }
  }
  isConnected(): boolean {
    return this.client?.connected;
  }
  
  waitUntilConnected(callback: () => void): void {
    if (this.isConnected()) {
      callback();
    } else {
      const interval = setInterval(() => {
        if (this.isConnected()) {
          clearInterval(interval);
          callback();
        }
      }, 200); // essaie toutes les 200ms
    }
  }
  
  
  
}