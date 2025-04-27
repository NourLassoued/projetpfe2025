import { ChangeDetectorRef, Component } from '@angular/core';
import { ReservationService } from '../../app/service/reservation.service';
import { SafeUrl } from '@angular/platform-browser';
import { jwtDecode } from 'jwt-decode';
import { FileService } from '../../app/service/file.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-espacereservation',
  templateUrl: './espacereservation.component.html',
  styleUrls: ['./espacereservation.component.css']
})
export class EspacereservationComponent {
  reservations: any[] = [];
 profileImageUrl: SafeUrl | null = null;
 user: any;
 filteredReservations: any[] = [];
 selectedStatus: string = '';
  constructor(private reservationService: ReservationService,
          private fileservice: FileService,
          private cdr: ChangeDetectorRef,
               private router: Router,
  ) {}


  ngOnInit(): void {
    this.loadReservations();
    this.loadUserData();
  }
  loadReservations(): void {
    this.reservationService.getAllReservations().subscribe({
      next: (data) => {
        this.reservations = data;

        this.filteredReservations = [...this.reservations];
      },
      error: (error) => {
        console.error('Erreur lors du chargement des réservations:', error);
      }
    });
  }

  loadUserData(): void {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      console.error("Aucun token trouvé !");
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

      }
      else {
        console.warn("Aucune image trouvée dans le token !");
      }




    } catch (error) {
      console.error("Erreur lors du décodage du token :", error);
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
      }
    });
  }
  logout(): void {

    localStorage.removeItem('accessToken')
    this.router.navigate(['/Front']);
  }
  onStatusFilterChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedStatus = selectElement.value;

    if (this.selectedStatus) {
      this.filteredReservations = this.reservations.filter(reservation => reservation.statusReservation === this.selectedStatus);
    } else {
      this.filteredReservations = [...this.reservations];
    }
  }

}
