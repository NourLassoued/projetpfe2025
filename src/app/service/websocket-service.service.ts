
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { Client, IMessage, Stomp } from '@stomp/stompjs';  // Utilise @stomp/stompjs

import { AuthServiceService } from './auth-service.service';
import { jwtDecode } from 'jwt-decode';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class WebsocketServiceService {  
  private client!: Client;  // Déclare correctement le type de client STOMP
  private notificationsSubject: Subject<string> = new Subject();
  private serverUrl = 'http://localhost:8088/nour/ws';  // URL du serveur WebSocket
  private userRole: string | null = null; // Récupère le rôle de l'utilisateur
  user: any = null;
  

  constructor(private authServiceService: AuthServiceService,
    private http: HttpClient
  ) {
  
  }
/*
   connect(userId: number, role: string): void {
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
  
    if (role !== 'PRESTATAIRE') {
      console.log('🔒 L’utilisateur n’est pas un prestataire, pas de connexion WebSocket.');
      return;
    }
  
    this.client = new Client({
      brokerURL: 'ws://localhost:8088/nour/ws/websocket',
      connectHeaders: {},
      debug: (str) => { 
       },
      reconnectDelay: 5000,
      onConnect: () => {
       
  
        this.client.subscribe(`/topic/notifications/${userId}`, (message: IMessage) => {
         
          this.notificationsSubject.next(message.body);
        });
      },
      onStompError: (frame) => {
        console.error('Erreur STOMP:', frame);
      }
    });
  
    this.client.activate();
  }
  */
  connect(userId: number, role: string): void {
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
  
    if (role !== 'PRESTATAIRE') {
      console.log('🔒 L’utilisateur n’est pas un prestataire, pas de connexion WebSocket.');
      return;
    }
  
    this.client = new Client({
      brokerURL: 'ws://localhost:8088/nour/ws/websocket',
      connectHeaders: {},
      reconnectDelay: 5000,
      onConnect: () => {
        // 1️⃣ Abonnement aux notifications temps réel
        this.client.subscribe(`/topic/notifications/${userId}`, (message: IMessage) => {
          this.notificationsSubject.next(message.body);
        });
  
        // 2️⃣ Récupération des anciennes notifications
        this.http.get<string[]>(`http://localhost:8088/nour/notifications/${userId}`)
          .subscribe(oldMessages => {
            oldMessages.forEach(msg => this.notificationsSubject.next(msg));
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

  /**
   * Déconnexion propre de STOMP
   */
  disconnect(): void {
    if (this.client && this.client.connected) {
      this.client.deactivate(); // Arrêter la connexion
     
    }
  }
  
}