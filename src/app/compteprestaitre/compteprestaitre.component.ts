import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FileService } from '../service/file.service';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { DemandeService } from '../service/demande.service';
import { Demande } from 'src/models/Demande';
import { UtilisateurService } from '../service/utilisateur.service';
import { Postulation } from 'src/models/Postulation';


@Component({
  selector: 'app-compteprestaitre',
  templateUrl: './compteprestaitre.component.html',
  styleUrls: ['./compteprestaitre.component.css']
})
export class CompteprestaitreComponent implements OnInit{
  user: any = null;
  profileImageUrl: SafeUrl | null = null; 
  userId!: number;
  showDetailsMap: { [key: number]: boolean } = {}; // Objet pour stocker l'état des détails
  // Variables pour le modal de postulation
  showModal: boolean = false;
  selectedDemande!: Demande;
  commentaire: string = '';;
  demandesDisponibles: Demande[] = [];
  constructor(private fileService: FileService,
     private sanitizer: DomSanitizer, 
     private utilisateurService:UtilisateurService,
 
     private demandeService: DemandeService) {}
  ngOnInit(): void {
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
         
          this.loadProfileImage(this.user.image);
        } else {
          console.warn(" Aucune image trouvée dans le token !");
        }
        if (this.userId) { // 👉 Vérifie si l'ID est bien défini avant l'appel
          console.log("📥 Appel de getDemandesDisponibles()...");
          this.getDemandesDisponibles();
        } else {
          console.error("❌ Erreur : ID utilisateur non défini !");
        }
      } catch (error) {
        console.error(' Erreur lors du décodage du token:', error);
      }
    } else {
      console.warn(" Aucun token trouvé dans localStorage !");
    }
  }
  getDemandesDisponibles(): void {
    if (this.userId) {
      this.demandeService.getDemandesDisponibles(this.userId).subscribe(
        (data: Demande[]) => {
          this.demandesDisponibles = data;
          this.demandesDisponibles.forEach(demande => {
            if (demande.idDemande !== undefined) {
              this.showDetailsMap[demande.idDemande] = false;
            }
          });
        },
        error => console.error('Erreur lors de la récupération des demandes disponibles', error)
      );
    } else {
      console.warn("⚠️ Impossible de récupérer les demandes : utilisateur non identifié !");
    }
  }
  
  toggleDetails(demandeId?: number): void {
    if (demandeId !== undefined) {
      this.showDetailsMap[demandeId] = !this.showDetailsMap[demandeId];
    }
  }

  loadProfileImage(filename: string): void {
    this.fileService.getImage(filename).subscribe({
      next: (imageBlob) => {
        const objectURL = URL.createObjectURL(imageBlob);
        this.profileImageUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      },
      error: (err) => {
        console.error(' Erreur de chargement de l\'image', err);
        this.profileImageUrl = null; 
      }
    });
  }

 
envoyerPostulation(): void {
  // Validation du commentaire
  if (!this.commentaire || this.commentaire.trim() === '') {
    console.error('Le commentaire est requis.');
    return;  // Ne pas envoyer la requête si le commentaire est vide
  }

  // Validation de la demande
  if (!this.selectedDemande || !this.selectedDemande.idDemande) {
    console.error('La demande sélectionnée est invalide.');
    return;  // Ne pas envoyer la requête si la demande est invalide
  }

  // Validation de l'utilisateur
  if (!this.user || !this.user.id) {
    console.error('L\'utilisateur est invalide.');
    return;
  }


    const postulation: Postulation = {
      commentaire: this.commentaire,
      datePostulation: new Date(),
      demande: { idDemande: this.selectedDemande.idDemande }, 
      prestataire: { idUtilisateur: this.user.id }
    };

  this.utilisateurService.postuler(this.selectedDemande.idDemande, this.user.id, postulation)
    .subscribe({
      next: (response) => {
        console.log('Postulation envoyée avec succès', response);
        this.closeModal();  // Fermer le modal après l'envoi
      },
      error: (error) => {
        // Ajout de plus de détails pour faciliter le débogage
        console.error('Erreur lors de l\'envoi de la postulation', error);
        if (error.status === 400) {
          alert('Une erreur de validation s\'est produite. Veuillez vérifier les données et réessayer.');
        } else {
          alert('Une erreur inconnue est survenue. Veuillez réessayer plus tard.');
        }
      }
    });
}


  
  
  setupMenuToggle(): void {
    const menuIcon = document.getElementById('menu-icon');
    const profileMenu = document.getElementById('profile-menu');
    const logoutButton = document.getElementById('logout-btn'); 

    if (menuIcon && profileMenu) {
      menuIcon.addEventListener('click', () => {
        profileMenu.classList.toggle('active');
      });
    }

  }
  openModal(demande: Demande): void {
    console.log('Ouverture du modal pour la demande :', demande); 
    this.selectedDemande = demande;  
    this.commentaire = '';           
    this.showModal = true;          
  }
  closeModal(): void {
    this.showModal = false;
  }

 

}

