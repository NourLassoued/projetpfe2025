import { Component, OnInit } from '@angular/core';
import { MessageService } from '../service/message.service';
import { jwtDecode } from 'jwt-decode';

import { FileService } from '../service/file.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { WebsocketServiceService } from '../service/websocket-service.service';
import { AuthServiceService } from '../service/auth-service.service';
import { AvisService } from '../service/avis.service';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  selectedContactId!: number;
conversation: any[] = [];
  userId!: number;
  newMessage: string = '';
  user: any;
  selectedContact: any = null;
  scoreMap: { [key: number]: number } = {};

    profileImageUrl: SafeUrl | null = null; 
  lastMessages: any[] = [];
  imageUrls: { [key: number]: SafeUrl | null } = {};
  nombreAvisMap: { [key: number]: number } = {};
  constructor(private messageService: MessageService,
     private fileService: FileService, 
     private sanitizer: DomSanitizer, 
      private websocketService: WebsocketServiceService,
      private authService: AuthServiceService,
      private avisService:AvisService
  ) {}

  ngOnInit(): void {
    this.loadUserData();
 if (this.userId) {
   
    this.websocketService.connect(this.userId, this.authService.getUserRole()!);

   
    this.websocketService.getMessages().subscribe((msg) => {
      const received = JSON.parse(msg.body);
    
     
      

      // Ajout des messages reçus à la conversation en cours
      if (
        received.sender.idUtilisateur === this.selectedContactId ||
        received.receiver.idUtilisateur === this.selectedContactId
      ){
        this.conversation.push(received);
        this.markMessageAsRead(this.selectedContactId)
        this.getLastMessages();
   
      }

      // Jouer un son si le message n'est pas de l'utilisateur actuel
      if (received.sender.idUtilisateur !== this.userId) {
        this.playNotificationSound();
      }
    });

  
  }
  
  else {
    console.warn("userId non défini après chargement du token !");
  }
}
loadUserData(): boolean {
  const token = localStorage.getItem('accessToken');

  if (token) {
    try {
      const decodedToken: any = jwtDecode(token);
      this.user = decodedToken;
      this.userId = this.user.id;
      this.getLastMessages();
      return true;
    } catch (error) {
      console.error('Erreur lors du décodage du token:', error);
    }
  } else {
    console.warn("Aucun token trouvé dans localStorage !");
  }

  return false;
}

 getLastMessages(): void {
  this.messageService.getLastMessagesByUser(this.userId).subscribe({
    next: (messages) => {
      this.lastMessages = messages;
    

      this.lastMessages.forEach(message => {
        // Si l'utilisateur connecté est le sender, on récupère l'image du receiver
        const contact = message.sender.idUtilisateur === this.userId ? message.receiver : message.sender;

        if (contact?.idUtilisateur && contact?.image) {
          this.loadProfileImage(contact.idUtilisateur, contact.image);

         
        }
        
      });

    },
    error: (err) => {
      console.error("Erreur de récupération des messages :", err);
    }
  });
}

loadProfileImage(userId: number, filename: string): void {
  this.fileService.getImage(filename).subscribe({
    next: (imageBlob) => {
      const objectURL = URL.createObjectURL(imageBlob);
      this.imageUrls[userId] = this.sanitizer.bypassSecurityTrustUrl(objectURL);
    },
    error: (err) => {
      console.error('Erreur de chargement de l\'image', err);
      this.imageUrls[userId] = null;
    }
  });
}

getConversationWith(contactId: number): void {
  this.selectedContactId = contactId;

  const contactMessage = this.lastMessages.find(msg =>
    msg.sender.idUtilisateur === contactId || msg.receiver.idUtilisateur === contactId
  );
  
  // Détermine le bon objet "utilisateur" pour afficher son nom et image
  this.selectedContact = contactMessage?.sender.idUtilisateur === this.userId
    ? contactMessage?.receiver
    : contactMessage?.sender;
    if (this.selectedContact?.idUtilisateur && this.selectedContact?.role === 'PRESTATAIRE') {
      this.avisService.getScoreMoyen(this.selectedContact.idUtilisateur).subscribe({
        next: (score) => {
          this.scoreMap[this.selectedContact.idUtilisateur] = score;
        },
        error: (err) => {
          console.error('Erreur récupération score :', err);
          this.scoreMap[this.selectedContact.idUtilisateur] = 0;
        }
      });
    }
    this.avisService.getNombreAvisPourUtilisateur(this.selectedContact?.idUtilisateur).subscribe({
      next: (nbAvis) => {
        this.nombreAvisMap[this.selectedContact?.idUtilisateur] = nbAvis;
      },
      error: (err) => {
        console.error('Erreur récupération nombre d\'avis :', err);
        this.nombreAvisMap[this.selectedContact?.idUtilisateur] = 0;
      }
    });

  
  this.messageService.getConversation(this.userId, contactId).subscribe({
    next: (messages) => {
      this.conversation = messages || [];
      this.conversation.forEach(msg => {
        if (!msg.delivered && msg.receiver.idUtilisateur === this.userId) {
          this.markMessageAsRead(msg.id);
        }
      });
    

    },
    error: (err) => {
      console.error('Erreur lors de la récupération de la conversation :', err);
    }
  });
}

sendMessage(): void {
  if (!this.newMessage.trim()) return;

  const message = {
    sender: { idUtilisateur: this.userId },
    receiver: { idUtilisateur: this.selectedContactId },
    content: this.newMessage,
    timestamp: new Date()
  };

  // Vérifie que la connexion WebSocket est prête
  this.websocketService.waitUntilConnected(() => {
    this.websocketService.sendMessagetempsreel(message);
  });

  // Ajoute localement le message
  this.conversation.push(message);
  this.newMessage = '';

}
playNotificationSound(): void {
  const audio = new Audio();
  audio.src = 'assets/sounds/maessage.mp3';
  audio.load();
  audio.play().catch(error => {
    console.warn("Erreur de lecture audio :", error);
  });
}
getUndeliveredMessages(): void {
  this.messageService.getUndeliveredMessages(this.userId).subscribe({
    next: (undeliveredMessages) => {

     
    },
    error: (err) => {
      console.error("Erreur lors de la récupération des messages non lus", err);
    }
  });
}
markMessageAsRead(messageId: number): void {
  if (!messageId) {
    console.warn("ID du message introuvable !");
    return;
  }

  // Marquer le message comme "vu" dans la conversation
  const message = this.conversation.find(m => m.id === messageId);
  if (message) {
    message.readTimestamp = new Date().toISOString(); // Marque le message comme "vu"
    message.delivered = true; // Le message est livré et vu
  }

  // Envoie un message WebSocket de type "seen"
  this.websocketService.waitUntilConnected(() => {
    const seenMessage = {
      type: 'seen',
      messageId: messageId,
      receiverId: message?.receiver.idUtilisateur,  // L'ID du destinataire
      senderId: this.userId,  // L'ID de l'utilisateur actuel
    };
    this.websocketService.sendMessagetempsreel(seenMessage);
  });

  // Appel au backend pour marquer comme lu
  this.messageService.markAsRead(messageId).subscribe({
    next: () => {
      
    },
    error: (err) => {
      console.error("Erreur lors du marquage comme lu :", err);
    }
  });
}



}