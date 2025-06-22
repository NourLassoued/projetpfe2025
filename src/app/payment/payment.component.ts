import { Component } from '@angular/core';
import { PaymentService } from '../service/payment.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent {
  amount?: number;
  paymentId?: string;
  paymentStatus?: string;
  errorMessage?: string;

  constructor(private  readonly paymentService: PaymentService) { }
/*
  // Créer un paiement
  createPayment() {
    if (this.amount ) {
      this.paymentService.createPayment(this.amount).subscribe(
        response => {
          console.log('Paiement créé avec succès:', response);
          if (response && response.result && response.result.link) {
            // Redirection automatique vers le lien de paiement
            window.location.href = response.result.link;
            // Ou utiliser Angular Router pour rediriger vers la page de paiement (optionnel)
            // this.router.navigate([response.result.link]);
          }
        },
        error => {
          console.error('Erreur lors de la création du paiement:', error);
        }
      );
    }
  }


  // Vérifier le paiement
  verifyPayment() {
    if (this.paymentId) {
      this.paymentService.verifyPayment(this.paymentId).subscribe(
        (response) => {
          this.paymentStatus = `Payment Status: ${response.status}`;
        },
        (error) => {
          this.errorMessage = 'Error verifying payment: ' + error.message;
        }
      );
    }
  }
*/

}
