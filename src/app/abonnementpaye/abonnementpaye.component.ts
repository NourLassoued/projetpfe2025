import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../service/payment.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-abonnementpaye',
  templateUrl: './abonnementpaye.component.html',
  styleUrls: ['./abonnementpaye.component.css']
})
export class AbonnementpayeComponent   {
  email!: string;
  dejaUtiliseGratuit = false;
  emailValide = false;
 showModal = false;
  nom = '';
  //email = '';
  typeAbonnement = '';
  constructor(private route: ActivatedRoute,
    private paymentService: PaymentService,
    private router: Router,
   private toastr: ToastrService ) 
   {}




  afficherModal(type: string) {
    this.typeAbonnement = type;
    this.showModal = true;
  }

  fermerModal() {
    this.showModal = false;
    this.nom = '';
    this.email = '';
  }
payer() {
  if (!this.email || !this.nom) {
    this.toastr.warning("Veuillez remplir tous les champs.", "Champs requis");
    return;
  }

  if (this.typeAbonnement === 'GRATUIT') {
    this.paymentService.aDejaUtiliseGratuit(this.email).subscribe({
      next: (dejaUtilise: boolean) => {
        if (dejaUtilise) {
          this.toastr.warning("Vous avez déjà utilisé l'accès gratuit.", "Attention");
        } else {
          this.paymentService.activerGratuit(this.email).subscribe({
            next: () => {
              this.toastr.success("Votre compte a été activé gratuitement.", "Succès");
              this.fermerModal();
              this.router.navigate(['/login']);
            },
            error: (err) => {
              console.error('Erreur activation gratuite : ', err);
              this.toastr.error("Erreur lors de l'activation gratuite.", "Erreur");
              this.fermerModal();
            }
          });
        }
      },
      error: (err) => {
        console.error('Erreur vérification gratuit : ', err);
        this.toastr.error("Erreur lors de la vérification de l'accès gratuit.", "Erreur");
      }
    });
  } 
  else {
    this.paymentService.payerAbonnement(this.email, this.typeAbonnement).subscribe({
      next: (redirectUrl: string) => {
       
        window.location.href = redirectUrl;
      },
      error: (err) => {
        console.error('Erreur paiement : ', err);
        this.toastr.error("Erreur lors de la tentative de paiement.", "Erreur");
      }
    });
  }
}
}