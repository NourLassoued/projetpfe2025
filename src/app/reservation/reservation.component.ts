import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationService } from '../service/reservation.service';
import { FileService } from '../service/file.service';
import { ToastrService } from 'ngx-toastr';
import { jwtDecode } from 'jwt-decode';
@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent {
  prestataireImageUrls: { [key: number]: string } = {}; 
utilisateurs: any[] = [];  // Ajoute cette ligne si `utilisateurs` est utilisé
  serviceImageUrls: { [key: number]: string } = {};
  idDemande!: number;
  userId!: number;
  reservations: any[] = [];
  utilisateurId: number | null = null; 
  demandes: any[] = [];  // Ajout de cette déclaration
  imageUrls: { [key: number]: string } = {};
  user: any = null;
  constructor(private route: ActivatedRoute,
    private reservationService: ReservationService,
    private fileService: FileService,
    private toastr: ToastrService,
       private router: Router,
  ) {}

  ngOnInit(): void {
    this.idDemande = Number(this.route.snapshot.paramMap.get('idDemande'));
    console.log("ID de la demande récupéré :", this.idDemande);

  this.getReservations();
     this.loadUserData();
   
    
  
  }
  
  loadUserData(): void {
     const token = localStorage.getItem('accessToken');
   
     if (token) {
       try {
         const decodedToken: any = jwtDecode(token);
         this.user = decodedToken;
         this.userId = decodedToken.id;
        } catch (error) {
          console.error(' Erreur lors du décodage du token:', error);
        }
      } else {
        console.warn(" Aucun token trouvé dans localStorage !");
      }
    }
            
  getReservations(): void {
    this.reservationService.getReservationsByDemandeId(this.idDemande).subscribe(
      (data) => {
        this.reservations = data;
        console.log("Données reçues :", this.reservations);
        
        if (this.reservations.length > 0) {
          console.log("Demande associée :", this.reservations[0].demande);
          
          
          const demandeServiceImage = this.reservations[0].demande?.servicee?.imageService;
        if (demandeServiceImage) {
          this.getImage(demandeServiceImage, 0, 'service');
        }

     
        this.reservations.forEach((reservation, index) => {
          if (reservation.prestataire?.image) {
            console.log(`Chargement de l'image: ${reservation.prestataire.image}`);

this.getImage(reservation.prestataire.image, index, 'prestataire');

          
          }
        });

        
      }
    },
    (error) => {
      console.error("Erreur lors de la récupération des réservations :", error);
    }
  );
}

getImage(filename: string, index: number, type: 'service' | 'prestataire') {
  if (!filename) {
    console.warn(`Aucun fichier d'image fourni pour le type: ${type} à l'index: ${index}`);
    return;
  }

  const encodedFilename = encodeURIComponent(filename);
  this.fileService.getImage(encodedFilename).subscribe(
    (imageBlob) => {
      const imageUrl = URL.createObjectURL(imageBlob);

      if (type === 'service') {
        this.serviceImageUrls[index] = imageUrl;
      } else if (type === 'prestataire') {
        this.prestataireImageUrls[index] = imageUrl;
      } else {
        console.error(`Type d'image inconnu : ${type}`);
      }
    },
    (error) => {
      console.error(`Erreur lors du chargement de l'image (${type})`, error);
    }
  );
}
annulerReservation(reservationId: number): void {
  if (this.userId !== null) {
    this.reservationService.annulerReservation(reservationId, this.userId).subscribe(
      (response) => {

        this.toastr.success('Réservation annulée avec succès');
      },
      (error) => {
       
        if (error.status === 404) {
          this.toastr.error('Réservation introuvable');
        } else if (error.status === 400) {
          this.toastr.error('Vous ne pouvez pas annuler cette réservation');
        } else if (error.status === 500) {
          this.toastr.error('Erreur serveur, veuillez réessayer plus tard');
        } else {
          this.toastr.error('Erreur lors de l\'annulation de la réservation');
        }
      }
    );
  } else {
    console.error('ID utilisateur non trouvé');
    this.toastr.error('ID utilisateur non trouvé');
  }
}
terminerReservation(idReservation: number): void {
  if (this.userId !== null) {
    this.reservationService.terminerReservation(idReservation).subscribe(
      () => {
        this.toastr.success('Réservation terminée avec succès');
      },
      (error) => {
        console.error('Erreur lors de la terminaison de la réservation', error);
        this.toastr.error('Erreur lors de la terminaison de la réservation');
      }
    );
  } else {
    console.error('ID utilisateur non trouvé');
  }
}

getDaysRemaining(dateDemande: string): number {
  const today = new Date();
  const demandeDate = new Date(dateDemande);
  const timeDiff = demandeDate.getTime() - today.getTime();
  const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
  return daysRemaining;
}
goToProfile(userId?: number) {
 
  if (userId) {
    this.router.navigate(['/Profil', userId]);
  } else {
    console.error("ID non défini !");
  }
}

}



