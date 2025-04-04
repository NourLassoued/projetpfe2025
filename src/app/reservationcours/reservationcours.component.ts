import { Component } from '@angular/core';
import { Demande } from 'src/models/Demande';
import { FileService } from '../service/file.service';
import { Router } from '@angular/router';
import { DemandeService } from '../service/demande.service';
import { jwtDecode } from 'jwt-decode';
import { ReservationService } from '../service/reservation.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-reservationcours',
  templateUrl: './reservationcours.component.html',
  styleUrls: ['./reservationcours.component.css']
})
export class ReservationcoursComponent {
    showDemandes = false;
    serviceImageUrls: string[] = [];
    prestataireImageUrls: string[] = [];
    utilisateurId!: number;
    reservation: any;

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
       
      
          this.getReservationsEnAttente();
        
        }
        loadUserData(): void {
          const token = localStorage.getItem('accessToken');
        
          if (token) {
            try {
              const decodedToken: any = jwtDecode(token);
              this.user = decodedToken;
              this.userId = decodedToken.id;
        
              this.getReservationsEnAttente();
        
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
      
        getReservationsEnAttente(): void {
          this.reservationService.getReservationsEnAttenteParParticulier(this.userId).subscribe(
            (reservations) => {
              this.reservationsEnAttente = reservations;
              this.reservationsEnAttente.forEach((reservation, index) => {
               
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
              console.error('Erreur lors de la récupération des réservations en attente', error);
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
    
annulerReservation(reservationId: number): void {
  if (this.userId !== null) {
    this.reservationService.annulerReservation(reservationId, this.userId).subscribe(
      (response) => {

        this.toastr.success('Réservation annulée avec succès');
        this.getReservationsEnAttente();
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
      }           


