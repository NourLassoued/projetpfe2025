import { Component } from '@angular/core';
import { ChatbotServiceService } from '../service/chatbot-service.service';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent {
  message = ""
  response = ""
  error = ""
  isChatbotOpen = false
  isMinimized = false
  isTyping = false
  suggestionResponse: string = "";

  constructor(private  readonly chatbotService: ChatbotServiceService) { }

  toggleChatbot() {
    this.isChatbotOpen = !this.isChatbotOpen
    if (this.isChatbotOpen) {
      this.isMinimized = false
    }
  }

  closeChatbot() {
    this.isChatbotOpen = false;
    this.error = "";
    this.response = "";
    this.message = "";
    this.isTyping = false;
    this.suggestionResponse = "";
  }


  toggleMinimize() {
    this.isMinimized = !this.isMinimized
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === "Enter") {
      this.sendMessage()
    }
  }

  sendSuggestion(suggestionText: string) {
    this.response = ""

    let botResponse = "";

    switch (suggestionText) {
      case 'Je cherche un plombier':
        botResponse = '🔧  Pas de souci ! Nous avons plusieurs plombiers disponibles dans toute la région.';
        break;
      case 'Quels sont vos prix ?':
        botResponse = '💰 Nos prix varient selon le service. Par exemple, une intervention de base commence à partir de 30 DT.';
        break;
      case 'Comment ça marche ?':
        botResponse = '🛠️ Très simple ! Vous choisissez un service et passez une demande. Nous vous mettons ensuite en relation avec un prestataire, et le travail peut commencer.';
        break;
      case 'Contacter le support':
        botResponse = '📞 Vous pouvez nous contacter par email  ou appeler directement le 26 446 609.';
        break;
      default:
        botResponse = '🤖 Je n’ai pas compris votre demande. Pouvez-vous reformuler ?';
        break;
    }

    this.response = botResponse;
  }


  sendMessage() {
    if (!this.message.trim()) {
      this.response = "Message vide."
      return
    }

    this.isTyping = true
    this.error = ""

    this.chatbotService.sendMessage(this.message).subscribe({
      next: (res) => {
        this.isTyping = false
        this.response = res.response
        this.error = ""
        this.message = ""
      },
      error: (err) => {
        this.isTyping = false
        console.error(err)
        this.response = "Erreur lors de la communication avec le chatbot."
        this.error = err.message
        this.message = ""
      },
    })
  }
  getCurrentTime(): string {
    return new Date().toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }
}
