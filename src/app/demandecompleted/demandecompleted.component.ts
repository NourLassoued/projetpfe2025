import { Component } from '@angular/core';
import { Demande } from 'src/models/Demande';
import { FileService } from '../service/file.service';
import { Router } from '@angular/router';
import { DemandeService } from '../service/demande.service';
import { jwtDecode } from 'jwt-decode';
import { ReservationService } from '../service/reservation.service';

@Component({
  selector: 'app-demandecompleted',
  templateUrl: './demandecompleted.component.html',
  styleUrls: ['./demandecompleted.component.css']
})
export class DemandecompletedComponent {
  reservations: { [key: number]: any[] } = {};
  demandeId!: number;
  showDemandes = false;
  demandes: Demande[] = [];
  demandesAvecPostulations: { [key: number]: number } = {};
  user: any = null;
  postulations: { [key: number]: any[] } = {};
  categories: any[] = [];
  imageUrls: { [key: number]: string } = {};

  userId!: number;


  services: any[] = [];

  constructor(private readonly fileService: FileService,
    private readonly router: Router,
    private readonly demandeService: DemandeService,
    private readonly reservationservice: ReservationService) { }
  ngOnInit(): void {
    this.loadUserData();

    this.getDemandesByUserId();

  }
  loadUserData(): void {
    const token = localStorage.getItem('accessToken');

    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        this.user = decodedToken;
        this.userId = decodedToken.id;



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





  getImage(filename: string, index: number) {
    const encodedFilename = encodeURIComponent(filename);
    this.fileService.getImage(encodedFilename).subscribe({
      next: (imageBlob) => {
        const imageUrl = URL.createObjectURL(imageBlob);
        this.imageUrls[index] = imageUrl;
      },
      error: (error) => {
        console.error('Erreur lors du chargement de l\'image', error);
      }
    });
  }
  getReservations(idDemande: number): void {


    this.reservationservice.getReservationsByDemandeId(idDemande).subscribe({
      next: (data) => {
        this.reservations = data;
        this.router.navigate(['/Reservation', idDemande]);
      },
      error: (error) => {
        console.error("Erreur lors de la récupération des réservations :", error);
      }
    });
  }


  getDemandesByUserId() {
    if (this.userId) {
      this.demandeService.getDemandesTermineesByUserId(this.userId).subscribe({
        next: (data: Demande[]) => {
          this.demandes = data;

          this.demandes.forEach((demande, index) => {

            if (demande.servicee?.imageService) {
              this.getImage(demande.servicee.imageService, index);
            }
            if (demande.idDemande !== undefined) {
              this.getPostulationsByDemande(demande.idDemande);
            }
          });
        },
        error: (error) => {
          console.error('Erreur lors de la récupération des demandes', error);
        }
      });
    }
  }
  getPostulationsByDemande(idDemande: number): void {
    this.demandeService.getPostulationsByDemande(idDemande).subscribe({
      next: (postulationsData) => {
        this.demandesAvecPostulations[idDemande] = postulationsData.length;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des postulations pour la demande ' + idDemande + ':', error);
      }
    });
  }


  logout(): void {

    localStorage.removeItem('accessToken')
    this.router.navigate(['/Front']);
  }
  toggleDemandes() {
    this.showDemandes = !this.showDemandes;
  }
  handleDeleteClick(idDemande: number): void {
    if (idDemande && !isNaN(Number(idDemande))) {
      this.deleteDemande(idDemande);
    } else {
      console.error('ID de la demande invalide');
    }
  }


  deleteDemande(idDemande: number): void {
    this.demandeService.deleteDemande(idDemande).subscribe({
      next: () => {
        this.router.navigate(['/Mesdemandes']);
      },
      error: (error) => {
        console.error('Erreur lors de la suppression de la demande', error);
      }
    });
  }




}
