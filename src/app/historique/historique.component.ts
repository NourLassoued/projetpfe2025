import { Component } from '@angular/core';
import { FileService } from '../service/file.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ReservationService } from '../service/reservation.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-historique',
  templateUrl: './historique.component.html',
  styleUrls: ['./historique.component.css']
})
export class HistoriqueComponent {
     showDemandes = false;
      serviceImageUrls: string[] = [];
      prestataireImageUrls: string[] = [];
      utilisateurId!: number;
      reservation: any;
      reservationsTerminees: any[] = [];
       user: any = null;
       postulations: { [key: number]: any[] } = {};
          categories: any[] = [];
          imageUrls: { [key: string]: string } = {};
  
          reservationsEnAttente: any[] = [];
        userId!: number;
      
    
        services: any[] = [];
     
          constructor(private fileService: FileService, 
            private router: Router,
         private toastr: ToastrService,
            private reservationService: ReservationService) {}
          ngOnInit(): void {
            this.loadUserData();
         
        
            this.getReservationsTerminees();
          
          }
          loadUserData(): void {
            const token = localStorage.getItem('accessToken');
          
            if (token) {
              try {
                const decodedToken: any = jwtDecode(token);
                this.user = decodedToken;
                this.userId = decodedToken.id;
          
                this.getReservationsTerminees();
          
                if (this.user.image) {
                 
                  
                } else {
                  console.warn(" Aucune image trouvée dans le token !");
                }
              } catch (error) {
                console.error(' Erreur lors du décodage du token:', error);
              }
            } else {
              console.warn(" Aucun token trouvé dans localStorage !");
            }
          }
        
          getReservationsTerminees(): void {
            this.reservationService.getReservationsTermineesByParticulier(this.userId).subscribe(
              (reservations) => {
                this.reservationsTerminees = reservations;
                this.reservationsTerminees.forEach((reservation, index) => {
                 
                  if (reservation.demande?.servicee?.imageService) {
                    this.getImage(reservation.demande.servicee.imageService, index, 'service');
                  }
          
                 
                  if (reservation.prestataire?.image) {
                    this.getImage(reservation.prestataire.image, index, 'prestataire');
                    console.log(reservation.prestataire.image);
                  }
                });
              },
              (error) => {
                console.error('Erreur lors de la récupération des réservations terminées', error);
              }
            );
          }
          
          getImage(filename: string, index: number, type: 'service' | 'prestataire'): void {
            this.fileService.getImage(filename).subscribe(
                (imageBlob) => {
                    const imageUrl = URL.createObjectURL(imageBlob);
                    if (type === 'service') {
                        this.serviceImageUrls[index] = imageUrl;
                    } else if (type === 'prestataire') {
                        this.prestataireImageUrls[index] = imageUrl;
                    }
                },
                (error) => {
                    console.error('Erreur lors du chargement de l\'image', error);
                      
                }
            );
        }
    
        handleDeleteClick(): void {
         
          console.log('Réservation annulée');
          
      }
      
         
        logout(): void {
      
          localStorage.removeItem('accessToken')
          this.router.navigate(['/Front']); 
        }
        toggleDemandes() {
          this.showDemandes = !this.showDemandes;
        }
        goToProfile(prestataireId: number, utilisateurId: number, demandeId: number): void {
          this.router.navigate([`/profile/${prestataireId}`]);
      }
      gererDemande(idDemande: string) {
        this.router.navigate(['/gerer-demande'], { queryParams: { id: idDemande } });
        console.log('Réservation annulée', idDemande);
      }
}   
  
  
  


