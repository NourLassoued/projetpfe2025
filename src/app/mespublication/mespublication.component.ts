import { Component } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FileService } from '../service/file.service';
import { ToastrService } from 'ngx-toastr';
import { PublicationService } from '../service/publication.service';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { Publication } from 'src/models/Publication';
import { CommentaireService } from '../service/commentaire.service';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';


@Component({
  selector: 'app-mespublication',
  templateUrl: './mespublication.component.html',
  styleUrls: ['./mespublication.component.css']
})
export class MespublicationComponent {
  showNotification = false;
  publicationSelectionnee: any = null;
  user: any = null;
  profileImageUrl: SafeUrl | null = null;
  userId!: number;
  publications: Publication[] = [];
  isModalOpen = false;
  publicationlist: Publication[] = [];
  particulierImages: { [key: number]: SafeUrl } = {};
  currentPage: number = 1;
  itemsPerPage: number = 2;
  constructor(
    private fileService: FileService,
    private sanitizer: DomSanitizer,
    private toastr: ToastrService,
    private publicationService: PublicationService,
    private router: Router,
    private commaintreservice: CommentaireService
  ) { }
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
        this.publicationlist = [...publications]; 
        this.currentPage = 1; 

        this.publications.forEach(publication => {
          if (publication.id !== undefined) {
            this.commaintreservice.getCommentairesParPublication(publication.id).subscribe({
              next: (commentaires) => {
                publication.commentaires = commentaires;
                this.loadParticulierImages();

              },
              error: (error) => {
                console.error(`Erreur lors de la récupération des commentaires pour la publication ${publication.id}:`, error);
              }
            });
          } else {
            console.warn('Publication sans ID détectée, impossible de récupérer les commentaires.', publication);
          }
        });
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

  loadParticulierImages() {
    this.publications.forEach(pub => {
      pub.commentaires?.forEach(commentaire => {
        const particulier = commentaire.particulier;

        if (particulier?.idUtilisateur && particulier.image && !this.particulierImages[particulier.idUtilisateur]) {
          this.fileService.getImage(particulier.image).subscribe({
            next: (imageBlob) => {
              const objectURL = URL.createObjectURL(imageBlob);
              this.particulierImages[particulier.idUtilisateur!] = this.sanitizer.bypassSecurityTrustUrl(objectURL);
            },
            error: (err) => {
              console.error('Erreur chargement image particulier', err);
            }
          });
        }
      });
    });
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
  afficherCommentaires(publication: any): void {
    this.publicationSelectionnee = publication;
  }

  fermerModal(): void {
    this.publicationSelectionnee = null;
  }
  onSupprimerCommentaire(id: number) {
    this.commaintreservice.supprimerCommentaire(id).subscribe({
      next: () => {
        this.toastr.success('Commentaire supprimé avec succès', 'Succès');
        this.fermerModal();
        },
        error: err => {
          console.error('Erreur lors de la suppression', err);
          this.toastr.error('Échec de la suppression du commentaire', 'Erreur');
        }
      });
    }
     getRelativeTime(dateString: string | Date): string {
        return 'il y a ' + formatDistanceToNow(new Date(dateString), { addSuffix: false, locale: fr });
      }

      get paginatedPublications(): Publication[] {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        return this.publications.slice(start, end);
      }
    
      get totalPages(): number {
        return Math.ceil(this.publications.length / this.itemsPerPage);
      }
    
   
      changePage(page: number): void {
        if (page >= 1 && page <= this.totalPages) {
          this.currentPage = page;
        }
      }
    }
