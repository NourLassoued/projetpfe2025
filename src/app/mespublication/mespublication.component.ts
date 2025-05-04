import { Component } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FileService } from '../service/file.service';
import { ToastrService } from 'ngx-toastr';
import { PublicationService } from '../service/publication.service';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { Publication } from 'src/models/Publication';

@Component({
  selector: 'app-mespublication',
  templateUrl: './mespublication.component.html',
  styleUrls: ['./mespublication.component.css']
})
export class MespublicationComponent {
     user: any = null;
      profileImageUrl: SafeUrl | null = null;
      userId!: number;
      publications: Publication[] = [];
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
              this.getPublications(this.userId); 
            } else {
              console.error('Erreur : ID utilisateur non défini!');
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



      getPublications(entrepriseId: number): void {
        this.publicationService.getPublicationsParEntreprise(entrepriseId).subscribe({
          next: (publications) => {
            this.publications = publications; 
            console.log('Publications récupérées:', this.publications);
          },
          error: (error) => {
            console.error('Erreur lors de la récupération des publications:', error);
            this.toastr.error('Impossible de récupérer les publications', 'Erreur');
          }
        });
      }




  logout(): void {
    localStorage.removeItem('accessToken');
    this.router.navigate(['/Front']);
  }
  supprimerPublication(id: number): void {
    this.publicationService.supprimerPublication(id).subscribe({
      next: () => {
        this.publications = this.publications.filter(publication => publication.id !== id);
        this.toastr.success('Publication supprimée avec succès');
      },
      error: (error) => {
        this.toastr.error('Erreur lors de la suppression de la publication', 'Erreur');
        console.error('Erreur de suppression:', error);
      }
    });
  }
}
