import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { jwtDecode } from 'jwt-decode';
import { ReservationService } from '../service/reservation.service';
import { Reservation } from 'src/models/Reservation';

@Component({
  selector: 'app-reservationprestaitre',
  templateUrl: './reservationprestaitre.component.html',
  styleUrls: ['./reservationprestaitre.component.css']
})
export class ReservationprestaitreComponent {
  reservations: Reservation[] = [];
  userId!: number;
  user: any = null;
  constructor(
    private reservationservice:ReservationService,
  private router:
         Router,
          private toastr: ToastrService){}
         
          ngOnInit(): void {
            this.loadUserData();
            this.loadReservations(this.userId);
          }

              loadUserData(): void {
                    const token = localStorage.getItem('accessToken');
                  
                    if (token) {
                      try {
                        const decodedToken: any = jwtDecode(token);
                        this.user = decodedToken;
                        this.userId = decodedToken.id;
                      
                  
                       
                        
                        if (this.userId) {
                         
                        } else {
                          console.error("Erreur : ID utilisateur non défini !");
                        }
                      } catch (error) {
                        console.error('Erreur lors du décodage du token:', error);
                      }
                    } else {
                      console.warn("Aucun token trouvé dans localStorage !");
                    }
                  }
                  annulerReservation(reservationId: number): void {
                    if (confirm('Voulez-vous vraiment annuler cette réservation ?')) {
                      this.reservationservice.annulerReservation(reservationId, this.userId).subscribe(() => {
                        this.toastr.success('Réservation annulée avec succès !');
                        this.loadReservations(this.userId); // Recharger les données
                      }, error => {
                        this.toastr.error('Erreur lors de l\'annulation');
                        console.error(error);
                      });
                    }
                  }
                
        
                  loadReservations(prestataireId: number): void {
                    this.reservationservice.getReservationsConfirmées(prestataireId).subscribe(
                      (data: Reservation[]) => {
                        this.reservations = data; // Stocker les réservations confirmées
                        console.log('Réservations confirmées:', this.reservations); // Afficher dans la console pour vérifier
                      },
                      (error) => {
                        console.error('Erreur lors de la récupération des réservations:', error);
                        this.toastr.error('Erreur lors de la récupération des réservations');
                      }
                    );
                  }


































  logout(): void {
  
    localStorage.removeItem('accessToken')
    this.router.navigate(['/Front']); 
  }


}
