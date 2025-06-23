import { Component } from '@angular/core';
import { Demande } from 'src/models/Demande';
import { FileService } from '../service/file.service';
import { Router } from '@angular/router';
import { DemandeService } from '../service/demande.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-demandeterminne',
  templateUrl: './demandeterminne.component.html',
  styleUrls: ['./demandeterminne.component.css']
})
export class DemandeterminneComponent {
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
    private readonly demandeService: DemandeService) { }
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
          // Si l'image est présente dans le token, on la récupère

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
    this.fileService.getImage(encodedFilename).subscribe(
      (imageBlob) => {
        const imageUrl = URL.createObjectURL(imageBlob);
        this.imageUrls[index] = imageUrl;
      },
      (error) => {
        console.error('Erreur lors du chargement de l\'image', error);

      }
    );
  }

  getDemandesByUserId() {
    if (this.userId) {
      this.demandeService.getDemandesByUtilisateurDateBefore(this.userId).subscribe(
        (data: Demande[]) => {
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
        (error) => {
          console.error('Erreur lors de la récupération des demandes', error);
        }
      );
    }
  }
  getPostulationsByDemande(idDemande: number): void {
    this.demandeService.getPostulationsByDemande(idDemande).subscribe(
      (postulationsData) => {
        this.demandesAvecPostulations[idDemande] = postulationsData.length; // Stocke le nombre de postulations
      },
      (error) => {
        console.error('Erreur lors de la récupération des postulations pour la demande ' + idDemande + ':', error);
      }
    );
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
    this.demandeService.deleteDemande(idDemande).subscribe(
      () => {

        this.router.navigate(['/Mesdemandes']);
      },
      (error) => {
        console.error('Erreur lors de la suppression de la demande', error);
      }
    );

  }


}