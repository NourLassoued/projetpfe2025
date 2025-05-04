import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FileService } from '../service/file.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { jwtDecode } from 'jwt-decode';
import { Publication } from 'src/models/Publication';
import { PublicationService } from '../service/publication.service';

@Component({
  selector: 'app-comptentreprise',
  templateUrl: './comptentreprise.component.html',
  styleUrls: ['./comptentreprise.component.css']
})
export class ComptentrepriseComponent {
    user: any = null;
    profileImageUrl: SafeUrl | null = null;
    userId!: number;
    isModalOpen = false;

    constructor(
      private fileService: FileService,
      private sanitizer: DomSanitizer,
      private toastr: ToastrService,
      private publicationService: PublicationService,
      private router: Router,
    ) {}
    ngOnInit(): void {
      this.loadUserData();
      ;
    }
    nouvellePublication: Publication = {
      titre: '',
      description: ''
    };


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
            console.warn(' Aucune image trouvée dans le token !');
          }
          if (this.userId) {
          } else {
            console.error(' Erreur : ID utilisateur non défini !');
          }
        } catch (error) {
          console.error(' Erreur lors du décodage du token:', error);
        }
      } else {
        console.warn(' Aucun token trouvé dans localStorage !');
      }
    }
    loadProfileImage(filename: string): void {
      this.fileService.getImage(filename).subscribe({
        next: (imageBlob) => {
          const objectURL = URL.createObjectURL(imageBlob);
          this.profileImageUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        },
        error: (err) => {
          console.error(" Erreur de chargement de l'image", err);
          this.profileImageUrl = null;
        },
      });
    }
  
    openModal(): void {
      this.isModalOpen = true; 
    }
  
    closeModal(): void {
      this.isModalOpen = false; 
    }
  




    ajouterPublication(): void {
      if (this.userId && this.nouvellePublication.titre && this.nouvellePublication.description) {
        this.publicationService.ajouterPublication(this.nouvellePublication, this.userId).subscribe({
          next: (res) => {
            this.toastr.success('Publication ajoutée avec succès !');
            this.nouvellePublication = { titre: '', description: '' }; 
            this.closeModal(); 
          },
          error: (err) => {
            console.error('Erreur lors de l’ajout de la publication', err);
            this.toastr.error('Erreur lors de l’ajout');
          }
        });
      } else {
        this.toastr.warning('Veuillez remplir tous les champs');
      }
    }
  












  logout(): void {
    localStorage.removeItem('accessToken');
    this.router.navigate(['/Front']);
  }
}
