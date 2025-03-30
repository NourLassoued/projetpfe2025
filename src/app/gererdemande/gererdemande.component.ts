import { Component, HostListener, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DemandeService } from '../service/demande.service';
import { FileService } from '../service/file.service';

import { jwtDecode } from 'jwt-decode';

import { Demande } from 'src/models/Demande';

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
  userId!: number;
  demande: Demande = new Demande();
  demandeId!: number;
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
   ) 
   {
    const today = new Date();

  
    today.setHours(0, 0, 0, 0);

   
    this.minDate = today.toISOString().slice(0, 16); 
   }
  ngOnInit() {
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
  
    
    this.demandeservice.getDemandeById(id).subscribe(
      (data) => {
        this.demande = data;
  
        if (this.demande?.date) {
          
          this.demandeDetails.date = this.formatDateForInput(this.demande.date);
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
      console.log('Demande mise à jour:', response);
      this.demande = response; 
      this.demandeDetails = { ...response }; 
      this.router.navigate(['/Mesdemandes']); 
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
     
      this.router.navigate(['/Mesdemandes']); 
    },
    (error) => {
      console.error('Erreur lors de la suppression de la demande', error);
    }
  );
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

}
