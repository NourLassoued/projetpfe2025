import { Component, HostListener, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DemandeService } from '../service/demande.service';
import { FileService } from '../service/file.service';
import { AuthServiceService } from '../service/auth-service.service';
import { UtilisateurService } from '../service/utilisateur.service';
import { jwtDecode } from 'jwt-decode';
import { co } from '@fullcalendar/core/internal-common';
import { Demande } from 'src/models/Demande';

@Component({
  selector: 'app-gererdemande',
  templateUrl: './gererdemande.component.html',
  styleUrls: ['./gererdemande.component.css']
})
export class GererdemandeComponent{
  
  showDetails = false;
 
  imageUrls: { [key: number]: string } = {};
  showNotification = false;
  showModel = false;
  user: any = null;
  utilisateurId!: number;
  userId!: number;
  demande: Demande = new Demande();
  demandeId!: number;
  demandeDetails: {
    idDemande: number | null;
    title: string;
    description: string;
    telephoneNumber: number | null;
    heureTravail: number | null;
    date: Date;
    
  } = {
    idDemande: null,
    title: '',
    description: '',
    telephoneNumber: null,
    heureTravail: null,
    date: new Date(),  
  };

  // Autres variables et méthodes...


  constructor(private route: ActivatedRoute,
    private fileService: FileService,
    private demandeservice:DemandeService,
    private router: Router,
    private auth:AuthServiceService,
  private Utilisateurservice:UtilisateurService) 
   {}

  ngOnInit() {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      this.utilisateurId = decodedToken.id; // Récupérer l'ID de l'utilisateur depuis le token
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
  
      console.log('userId',this.userId);
  
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
    this.fileService.getImage(encodedFilename).subscribe(
      (imageBlob) => {
        const imageUrl = URL.createObjectURL(imageBlob);
        this.imageUrls[index] = imageUrl; 
      },
      (error) => {
        console.error('Erreur lors du chargement de l\'image', error);
        
      }
    );
  }getDemandeDetails(id: number): void {
    console.log(`Récupération des détails pour la demande avec l'ID: ${id}`);
    
    this.demandeservice.getDemandeById(id).subscribe(
      (data) => {
        this.demande = data;
  
        if (this.demande?.date) {
          this.demandeDetails.date = new Date(this.demande.date); // Utilisez directement la date comme objet Date
        }
  
        // Vérification et récupération de l'image du service
        if (this.demande?.servicee?.imageService) {
          this.getImage(this.demande.servicee.imageService, 0); 
        } else {
          console.log('Aucune image disponible pour ce service');
        }
      },
      (error) => {
        console.error('Erreur lors de la récupération de la demande:', error);
      }
    );
  }
  
  // Méthode pour formater la date au format yyyy-MM-dd
  formatDateTime(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');  
    const day = String(date.getDate()).padStart(2, '0');  
    const hours = String(date.getHours()).padStart(2, '0');  
    const minutes = String(date.getMinutes()).padStart(2, '0');  
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
}updateDemande(): void {
  // Vérification des données avant de faire la requête
  this.demandeDetails = {
    idDemande: this.demandeId,
 
    
      title: this.demande.title ?? '',  // Si title est undefined, utiliser une chaîne vide
      description: this.demande.description ?? '',  // Si description est undefined, utiliser une chaîne vide
      telephoneNumber: this.demande.telephoneNumber ?? null,  // Si telephoneNumber est undefined, utiliser null
      heureTravail: this.demande.heureTravail ?? null,
      date: this.demande.date ? new Date(this.demande.date) : new Date()

    
  };

  console.log('Données à mettre à jour:', this.demandeDetails); // Ajoutez ceci pour déboguer

  this.demandeservice.updateDemande(this.demandeId, this.demandeDetails).subscribe(
    (response) => {
      console.log('Demande mise à jour:', response);
      this.demande = response; // Mettre à jour la demande avec la réponse du backend
      this.demandeDetails = { ...response }; // Optionnellement, vous pouvez aussi mettre à jour demandeDetails
      this.router.navigate(['/Mesdemandes']); // Rediriger vers la page des demandes
    },
    (error) => {
      console.error('Erreur lors de la mise à jour:', error);
      alert('Erreur lors de la mise à jour de la demande');
    }
  );
}




deleteDemande(idDemande: number): void {
  this.demandeservice.deleteDemande(idDemande).subscribe(
    () => {
      console.log('Demande supprimée avec succès');
      this.router.navigate(['/Mesdemandes']); // Rediriger vers "Mes demandes" après la suppression
    },
    (error) => {
      console.error('Erreur lors de la suppression de la demande', error);
    }
  );
}

// Méthode pour gérer le click sur le lien de suppression
handleDeleteClick(): void {
  if (this.demandeId && !isNaN(Number(this.demandeId))) {
    const idDemande = Number(this.demandeId);
    this.deleteDemande(idDemande);
  } else {
    console.error('ID de la demande invalide');
  }
}

@HostListener('document:click', ['$event'])
closeNotification(event: MouseEvent) {
  const notificationBox = document.querySelector('.notification-box');
  const notificationButton = document.querySelector('.task-card button');


  if (notificationBox && !notificationBox.contains(event.target as Node) && 
      notificationButton && !notificationButton.contains(event.target as Node)) {
    this.showNotification = false;
  }
}

// Prevent the click event from propagating when clicking inside the notification box
stopPropagation(event: MouseEvent) {
  event.stopPropagation();
}


}
