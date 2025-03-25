import { Component, HostListener, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DemandeService } from '../service/demande.service';
import { FileService } from '../service/file.service';
import { AuthServiceService } from '../service/auth-service.service';

@Component({
  selector: 'app-gererdemande',
  templateUrl: './gererdemande.component.html',
  styleUrls: ['./gererdemande.component.css']
})
export class GererdemandeComponent{
  demandeId: string | null = null;
  showDetails = false;
  demande: any;
  imageUrls: { [key: number]: string } = {};
  showNotification = false;
  showModel = false;
 
  constructor(private route: ActivatedRoute,
    private fileService: FileService,
    private demandeservice:DemandeService,
    private router: Router,
    private auth:AuthServiceService) 
   {}

  ngOnInit() {
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
 
  getDemandeDetails(id: number): void {
    console.log(`Récupération des détails pour la demande avec l'ID: ${id}`);
    
    this.demandeservice.getDemandeById(id).subscribe(
      (data) => {
        this.demande = data;
        if (this.demande.date) {
          // Si la date est déjà au format string, convertissez-la en objet Date
          const dateObj = new Date(this.demande.date);
  
          // Extraire la date et l'heure et les formater
          const year = dateObj.getFullYear();
          const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Ajouter un zéro devant si nécessaire
          const day = String(dateObj.getDate()).padStart(2, '0'); // Ajouter un zéro devant si nécessaire
          const hours = String(dateObj.getHours()).padStart(2, '0'); // Ajouter un zéro devant si nécessaire
          const minutes = String(dateObj.getMinutes()).padStart(2, '0'); // Ajouter un zéro devant si nécessaire
  
          // Format "YYYY-MM-DDTHH:mm" pour datetime-local
          this.demande.date = `${year}-${month}-${day}T${hours}:${minutes}`;
  
          console.log('Date pour le formulaire:', this.demande.date);
        }
        
      
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

toggleDetails() {
  this.showDetails = !this.showDetails;
}
modifierDemande() {
  console.log("Modifier ma demande");
 
}

annulerDemande() {
  console.log("Annuler ma demande");
 
}


affichrmodifier() {
  this.showNotification = !this.showNotification;
}
closeModel() {
  this.showModel = false;
}
openModel() {
  this.showModel = true;
}submitForm(): void {
  if (this.demandeId) {
    const id = Number(this.demandeId);

    if (isNaN(id)) {
      console.error('L\'ID de la demande est invalide');
      alert('L\'ID de la demande est invalide.');
      return;
    }

    // Vérifier si le token est bien présent avant d'envoyer la requête
    const token = this.auth.getAccessToken();
    if (!token) {
      console.error('Utilisateur non authentifié');
      alert('Vous devez être connecté pour mettre à jour une demande.');
      return;
    }

    this.demandeservice.updateDemande(id, this.demande).subscribe(
      (response) => {
        console.log('Demande mise à jour avec succès:', response);
        this.closeModel();
      },
      (error) => {
        console.error('Erreur lors de la mise à jour de la demande:', error);
        alert('Erreur lors de la mise à jour de la demande. Veuillez réessayer.');
      }
    );
  } else {
    console.error('L\'ID de la demande est manquant');
    alert('L\'ID de la demande est manquant.');
  }
}deleteDemande(idDemande: number): void {
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
