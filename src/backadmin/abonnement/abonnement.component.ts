import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { AbonmmentserviceService } from 'src/app/service/abonmmentservice.service';
import { FileService } from 'src/app/service/file.service';
import { PaymentService } from 'src/app/service/payment.service';
import { UtilisateurService } from 'src/app/service/utilisateur.service';
import { Abonnement } from 'src/models/Abonnement ';

@Component({
  selector: 'app-abonnement',
  templateUrl: './abonnement.component.html',
  styleUrls: ['./abonnement.component.css']
})
export class AbonnementComponent {
    user: any;
    profileImageUrl: string | null = null;
      utilisateursEnAttente: any[] = [];
abonnementsActifs: Abonnement[] = [];

   constructor(
      private utilisateurService: UtilisateurService,
       private fileservice: FileService,
         private abonnementService: AbonmmentserviceService, 

           private cdr: ChangeDetectorRef,
           private  paymentService:PaymentService,
    
      private router: Router
    ) { }
    ngDoCheck() { }
    logout(): void {
      localStorage.removeItem('accessToken');
      this.router.navigate(['/Front']);
    }
    ngOnInit(): void {
      this.loadAbonnementsActifs();
      const token = localStorage.getItem('accessToken');
      if (token) {
        const decodedToken: any = jwtDecode(token);
        this.user = decodedToken;
        if (this.user.image) {
          this.loadProfileImagee(this.user.image);
  
        }
      } else {
        console.warn('Aucun token trouvé !');
      }
    
      this.loadUserData();
        this.loadUtilisateursEnAttente();
    }
     loadUserData(): void {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      console.error('Aucun token trouvé !');
      return;
    }

    try {
      const decodedToken: any = jwtDecode(token);

      if (!decodedToken.id) {
        console.error("L'ID utilisateur est introuvable dans le token !");
        return;
      }

      this.user = decodedToken;
      if (this.user.image) {
        this.loadProfileImagee(this.user.image);
      }
      if (this.user.telephoneNumber) {
      } else {
        console.warn('Aucune image trouvée dans le token !');
      }
    } catch (error) {
      console.error('Erreur lors du décodage du token :', error);
    }
  }
   loadProfileImagee(imagePath: string): void {
    if (!imagePath) {
      this.profileImageUrl = 'assets/images/user.png';
      return;
    }

    this.fileservice.getImage(imagePath).subscribe({
      next: (imageBlob) => {
        const objectURL = URL.createObjectURL(imageBlob);
        this.profileImageUrl = objectURL;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Erreur lors du chargement de l'image :", err);
        this.profileImageUrl = 'assets/images/user.png';
      },
    });
  }
  loadUtilisateursEnAttente(): void {
    this.utilisateurService.getUtilisateursEnAttenteEntrepriseOuPrestataire()
      .subscribe({
        next: (utilisateurs) => {
          this.utilisateursEnAttente = utilisateurs;
          this.utilisateursEnAttente.forEach((prestataire) => {
            this.loadProfileImage(prestataire);
          });
        this.cdr.detectChanges();

        },
        error: (err) => {
          console.error('Erreur lors du chargement des utilisateurs en attente :', err);
        }
      });

  }
 loadProfileImage(prestataire: any): void {
    if (prestataire.image) {
      this.fileservice.getImage(prestataire.image).subscribe({
        next: (imageBlob) => {
          const objectURL = URL.createObjectURL(imageBlob);
          prestataire.image = objectURL;
        },
        error: () => {
          prestataire.image = 'assets/images/user.png';
        },
      });
    }
  }
  envoyerEmailBienvenue(email: string): void {
  this.paymentService.testEnvoyerEmailBienvenue(email).subscribe({
    next: (response) => {
     
    },
    error: (err) => {
      console.error('Erreur lors de l\'envoi de l\'email :', err);
    }
  });
}
loadAbonnementsActifs(): void {
  this.abonnementService.getAbonnementsActifs().subscribe({
    next: (abonnements) => {
      this.abonnementsActifs = abonnements;

      this.abonnementsActifs.forEach((abonnement) => {
        const utilisateur = abonnement.utilisateur;
        if (utilisateur && utilisateur.image) {
          console.log(`Image trouvée pour l'utilisateur : ${utilisateur.nom} (${utilisateur.image})`);
          this.loadProfileImage(abonnement);
          const imagePath = utilisateur.image;
          this.fileservice.getImage(imagePath).subscribe({
            next: (imageBlob) => {
              const objectURL = URL.createObjectURL(imageBlob);
              utilisateur.image = objectURL;
            },
            error: () => {
              utilisateur.image = 'assets/images/user.png';
            },
          });
        } else {
          console.warn(`Aucune image pour l'utilisateur : ${utilisateur?.nom ?? 'Inconnu'}`);
        }
      });

      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error('Erreur lors du chargement des abonnements actifs :', err);
    }
  });
}
}
