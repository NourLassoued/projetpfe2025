import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { FileService } from '../service/file.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { PaymentService } from '../service/payment.service';

@Component({
  selector: 'app-mesrevunes',
  templateUrl: './mesrevunes.component.html',
  styleUrls: ['./mesrevunes.component.css']
})

export class MesrevunesComponent {
  currentPage: number = 1;
itemsPerPage: number = 5;
  
  payments: any[] = [];

    user: any = null;
    profileImageUrl: SafeUrl | null = null;
    userId!: number;

    
  
   constructor(
        private sanitizer: DomSanitizer,
 private paymenService :PaymentService,
   private fileService: FileService,
      private router: Router,
   
    ) {}




      ngOnInit(): void {
        this.loadUserData();
        if (this.userId) {
          this.loadUserPayments(this.userId);  
        } else {
          console.error('Erreur : ID utilisateur non défini.');
        }  
       }

      loadUserData(): void {
        const token = localStorage.getItem('accessToken');
    
        if (token) {
          try {
            const decodedToken: any = jwtDecode(token);
            this.user = decodedToken;
            this.userId = decodedToken.id;
    
            if (this.user.image) {
              this.loadProfileImage(this.user.image);
            } else {
              console.warn(' Aucune image trouvée dans le token !');
            }
            if (this.userId) {
            } else {
              console.error(' Erreur : ID utilisateur non défini !');
            }
          } catch (error) {
            console.error(' Erreur lors du décodage du token:', error);
          }
        } else {
          console.warn(' Aucun token trouvé dans localStorage !');
        }
      }



  loadProfileImage(filename: string): void {
    this.fileService.getImage(filename).subscribe({
      next: (imageBlob) => {
        const objectURL = URL.createObjectURL(imageBlob);
        this.profileImageUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      },
      error: (err) => {
        console.error(" Erreur de chargement de l'image", err);
        this.profileImageUrl = null;
      },
    });
  }
  loadUserPayments(userId: number): void {
    this.paymenService.getPaymentsByUser(userId).subscribe({
      next: (payments) => {
        this.payments = payments;
        console.log("Paiements reçus :", payments);
      },
      error: (error) => {
        console.error("Erreur lors du chargement des paiements :", error);
      }
    });
  }
  


  logout(): void {
    localStorage.removeItem('accessToken');
    this.router.navigate(['/Front']);
  }
  get paginatedPayments(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.payments.slice(start, end);
  }
  
  get totalPages(): number {
    return Math.ceil(this.payments.length / this.itemsPerPage);
  }

}
