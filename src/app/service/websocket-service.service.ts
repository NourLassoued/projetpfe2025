
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { Client, IMessage, Stomp } from '@stomp/stompjs';  // Utilise @stomp/stompjs
import * as SockJS from 'sockjs-client'; 


@Injectable({
  providedIn: 'root'
})
export class WebsocketServiceService {  
  private client!: Client;  // Déclare correctement le type de client STOMP
  private notificationsSubject: Subject<string> = new Subject();
  private serverUrl = 'http://localhost:8088/nour/ws';  // URL du serveur WebSocket

  constructor() {
    this.connect();  // Tentative de connexion dès l'initialisation
  }

  /**
   * Tentative de connexion WebSocket avec STOMP
   */
  connect(): void {
    this.client = new Client({
        brokerURL: 'ws://localhost:8088/nour/ws/websocket',
        connectHeaders: {},
        debug: (str) => { console.log('STOMP debug:', str); }, // Ajout d'un débogage supplémentaire
        reconnectDelay: 5000,
        onConnect: (frame: any) => {
            console.log('✅ Connexion STOMP réussie:', frame);
            this.client.subscribe('/topic/notifications', (message: IMessage) => {
                console.log('📥 Notification reçue:', message.body);
                this.notificationsSubject.next(message.body);
            });
        },
        onStompError: (frame) => {
            console.error('❌ Erreur STOMP:', frame);
        }
    });
    this.client.activate();
}


  /**
   * Méthode pour obtenir les notifications sous forme d'Observable
   */
  getNotifications(): Observable<string> {
    return this.notificationsSubject.asObservable();
  }

  /**
   * Déconnexion propre de STOMP
   */
  disconnect(): void {
    if (this.client && this.client.connected) {
      this.client.deactivate(); // Arrêter la connexion
      console.log('🛑 Déconnecté de STOMP');
    }
  }
}