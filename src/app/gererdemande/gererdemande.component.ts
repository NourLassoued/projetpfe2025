import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DemandeService } from '../service/demande.service';
import { FileService } from '../service/file.service';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale'; 
import { jwtDecode } from 'jwt-decode';
import { ToastrService } from 'ngx-toastr';

import { Demande } from 'src/models/Demande';
import { Postulation } from 'src/models/Postulation';
import { ServiceeService } from '../service/servicee.service';
import { Utilisateur } from 'src/models/Utilisateur';
import { ReservationService } from '../service/reservation.service';
import { Reservation } from 'src/models/Reservation';
import { AvisService } from '../service/avis.service';


@Component({
  selector: 'app-gererdemande',
  templateUrl: './gererdemande.component.html',
  styleUrls: ['./gererdemande.component.css']
})
export class GererdemandeComponent{
  isDateInvalid: boolean = false; 
  showDetails = false;
  minDate: string;
  imageUrls: { [key: number]: string } = {};
  showNotification = false;
  showModel = false;
  user: any = null;
  utilisateurId!: number;
  serviceImageUrls: string[] = [];  
prestataireImageUrls: string[] = [];  
  userId!: number;
  demande: Demande = new Demande();
  demandeId!: number;
  reservation: Reservation = new Reservation();
  postulations: Postulation[] = [];
  utilisateurs: Utilisateur[] = [];
  user1: Utilisateur = { servicesOfferts: [] };
  avisVisiblesParUtilisateur: { [id: number]: number } = {};
  nombreAvisMap: { [key: number]: number } = {};

  scoreMap: { [key: number]: number } = {};  



  demandeDetails: {
    idDemande: number | null;
    title: string;
    description: string;
    telephoneNumber: number | null;
    heureTravail: number | null;

  date: string ;
   
    
  } = {
    idDemande: null,
    title: '',
    description: '',
    telephoneNumber: null,
    heureTravail: null,
    
    date: '',  
  
  };




  constructor(private route: ActivatedRoute,
    private fileService: FileService,
    private demandeservice:DemandeService,
    private router: Router,
    private serviceeService:ServiceeService,
    private reservationService: ReservationService,
    private toastr: ToastrService,
    private  avisService:AvisService
   ) 
   {
    const today = new Date();

  
    today.setHours(0, 0, 0, 0);

   
    this.minDate = today.toISOString().slice(0, 16); 
   }
  ngOnInit() {
    this.utilisateurs.forEach(utilisateur => {
      if (utilisateur.idUtilisateur !== undefined) {
        this.avisVisiblesParUtilisateur[utilisateur.idUtilisateur] = 2;
      }
    });
    
  
   
    const token = localStorage.getItem('accessToken');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      this.utilisateurId = decodedToken.id; 
    } else {
      console.warn('Aucun token trouvé dans le localStorage');
    }
    this.route.queryParams.subscribe(params => {
      this.demandeId = params['id'];
     
      if (this.demandeId) {
       
        const id = Number(this.demandeId);
        if (!isNaN(id)) {
          this.getDemandeDetails(id); 
        } else {
          console.error('L\'ID de la demande est invalide.');
        }
      }
    });
    this.loadUserData();
    
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
  getTempsEcoule(date?: Date): string {
    if (!date) {
      return 'Date inconnue'; 
    }
  
    return formatDistanceToNow(date, { addSuffix: true, locale: fr });
  }
  
  getImage(filename: string, index: number, type: 'service' | 'prestataire'  | 'utilisateur') {
    this.fileService.getImage(filename).subscribe(
      (imageBlob) => {
        const imageUrl = URL.createObjectURL(imageBlob);
        
        if (type === 'service') {
          this.serviceImageUrls[index] = imageUrl;  
        } else if (type === 'prestataire') {
          this.prestataireImageUrls[index] = imageUrl; 
        }
       else if (type === 'utilisateur') {
        this.utilisateurs[index].image = imageUrl;  
      
      }
    },
      (error) => {
        console.error('Erreur lors du chargement de l\'image', error);
      }
    );
  }
  
  getDemandeDetails(id: number): void {
  
    
    this.demandeservice.getDemandeById(id).subscribe(
      (data) => {
        this.demande = data;
  
        if (this.demande?.date) {
          
          this.demandeDetails.date = this.formatDateForInput(this.demande.date);
        }

        if (this.demande?.servicee?.imageService) {
         
          this.getImage(this.demande.servicee.imageService, 0, 'service'); 
          
        } else {
          console.log('Aucune image disponible pour ce service');
        }
        if (this.demande?.servicee?.idservice) {
          const serviceId = this.demande.servicee.idservice;
          this.serviceeService.getUtilisateursByServiceOrderedByRating(serviceId).subscribe(
            (utilisateurs: any[]) => {  
              this.utilisateurs = utilisateurs;
              this.utilisateurs.forEach((utilisateur, index) => {
              
  
                if (utilisateur['services'] && Array.isArray(utilisateur['services'])) {
                  utilisateur.servicesOfferts = utilisateur['services'].map((service: string) => ({
                    idservice: undefined,

                    nomservice: service.replace(/[\r\n]+/g, '').trim()
                  }));
                } else {
                  
                  utilisateur.servicesOfferts = [];
                }
  
                if (utilisateur.image) {
                  this.getImage(utilisateur.image, index, 'utilisateur');
                }
                if (utilisateur.idUtilisateur !== undefined && utilisateur.idUtilisateur !== null) {
                  this.avisService.getScoreMoyen(utilisateur.idUtilisateur).subscribe({
                    next: (score) => {
                    
                      if (score !== undefined && score !== null) {
                        if (utilisateur.idUtilisateur !== undefined) {
                            this.scoreMap[utilisateur.idUtilisateur] = score;
                        
                        
                        } else {
                            console.warn('idUtilisateur is undefined for a user.');
                        }
                      
                      }
                    },
                  });
                } 
                else {
                  console.error('idUtilisateur est undefined pour l\'utilisateur:', utilisateur);
                }
                if (utilisateur.idUtilisateur !== undefined) {
                  const idUtilisateur = utilisateur.idUtilisateur;
                
                
                  this.avisService.getNombreAvisPourUtilisateur(idUtilisateur).subscribe({
                    next: (nombreAvis) => {
                      this.nombreAvisMap[idUtilisateur] = nombreAvis;
                     
                    },
                  error: (error) => {
                    console.error('Erreur lors de la récupération du nombre d\'avis pour l\'utilisateur', utilisateur.idUtilisateur, ':', error);
                  }
                });
              }
                
              });
            },
            
            (error) => {
              console.error('Erreur lors de la récupération des utilisateurs:', error);
            }
          );
        }
  
          
        this.getPostulationsByDemande(id);
      },
      (error) => {
        console.error('Erreur lors de la récupération de la demande:', error);
      }
    );
  }
  getPostulationsByDemande(idDemande: number): void {
    this.demandeservice.getPostulationsByDemande(idDemande).subscribe(
      (postulationsData) => {
        
        this.postulations = postulationsData;

        this.postulations.forEach((postulation, index) => {
          if (postulation.prestataire?.image) {
          
            
            this.getImage(postulation.prestataire.image, index, 'prestataire');
          } else {
           
            this.imageUrls[index] = 'assets/default-avatar.png';
            console.warn(`Postulation ${postulation.id}: Aucun prestataire ou image, image par défaut utilisée.`);
          }
        });

       
      },
      (error) => {
        console.error('Erreur lors de la récupération des postulations pour la demande ' + idDemande + ':', error);
      }
    );
}

 
  formatDateForInput(date: string | number | Date): string {
    
    const d = new Date(date);
    
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');  
    const day = String(d.getDate()).padStart(2, '0');  
    const hours = String(d.getHours()).padStart(2, '0'); 
    const minutes = String(d.getMinutes()).padStart(2, '0');  


    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

toggleDetails() {
  this.showDetails = !this.showDetails;
}



affichrmodifier() {
  this.showNotification = !this.showNotification;
}
closeModel() {
  this.showModel = false;
}
openModel() {
  this.showModel = true;
}
updateDemande(): void {
  let updatedDate: string;

  
  if (typeof this.demandeDetails.date === 'number') {
    updatedDate = new Date(this.demandeDetails.date).toISOString().slice(0, 16);
  } else if (typeof this.demandeDetails.date === 'string') {
    updatedDate = this.demandeDetails.date; 
  } else {
    
    updatedDate = new Date().toISOString().slice(0, 16);
  }

  this.demandeDetails = {
    idDemande: this.demandeId,
 
    
      title: this.demande.title ?? '',  
      description: this.demande.description ?? '', 
      telephoneNumber: this.demande.telephoneNumber ?? null,  
      heureTravail: this.demande.heureTravail ?? null,

    date: updatedDate 

    
  };


  this.demandeservice.updateDemande(this.demandeId, this.demandeDetails).subscribe(
    (response) => {
      
      this.demande = response; 
      this.demandeDetails = { ...response }; 
      this.router.navigate(['/Mesdemandes']); 
    },
    (error) => {
      console.error('Erreur lors de la mise à jour:', error);
     
    }
  );
}




deleteDemande(idDemande: number): void {
  this.demandeservice.deleteDemande(idDemande).subscribe(
    () => {
     
      this.router.navigate(['/Mesdemandes']); 
    },
    (error) => {
      console.error('Erreur lors de la suppression de la demande', error);
    }
  );
}

goToProfile(prestataireId?: number, utilisateurId?: number, demandeId?: number) {
  if (!prestataireId || !utilisateurId || !demandeId) {
    console.error("Informations manquantes !");
    return;
  }


  this.router.navigate(['/Profil', prestataireId], {
    queryParams: { utilisateurId: utilisateurId, demandeId: demandeId }
  });
}




handleDeleteClick(): void {
  if (this.demandeId && !isNaN(Number(this.demandeId))) {
    const idDemande = Number(this.demandeId);
    this.deleteDemande(idDemande);
  } else {
    console.error('ID de la demande invalide');
  }
}

@HostListener('document:click', ['$event'])
onClickOutside(event: Event) {
  const notificationBox = document.querySelector('.box');
  if (this.showNotification && notificationBox && !notificationBox.contains(event.target as Node)) {
    this.showNotification = false;
  }
}
reserver(prestataireId: number) {
  if (!this.utilisateurId || !this.demandeId || !prestataireId) {
    this.toastr.error("Informations manquantes pour la réservation.", "Erreur");
    return;
  }


  this.reservation.dateReservation = new Date();


  this.reservationService.reserverPrestataire(this.utilisateurId, prestataireId, this.demandeId, this.reservation)
    .subscribe({
      next: (data) => {
        
        this.toastr.success("Réservation effectuée ! En attente de la réponse du prestataire."
, "Succès");
      },
      error: (err) => {
        console.error("Erreur lors de la réservation :", err);
        this.toastr.error("Échec de la réservation !", "Erreur");
      }
    });
}
toggleAvis(idUtilisateur: number, totalAvis: number): void {
  const current = this.avisVisiblesParUtilisateur[idUtilisateur];
  this.avisVisiblesParUtilisateur[idUtilisateur] = current > 2 ? 2 : totalAvis;
}

}