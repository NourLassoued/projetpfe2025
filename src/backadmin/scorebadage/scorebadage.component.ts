import { ChangeDetectorRef, Component } from '@angular/core';
import { FileService } from '../../app/service/file.service';
import { Router } from '@angular/router';
import { AvisService } from '../../app/service/avis.service';

import { jwtDecode } from 'jwt-decode';
import { SafeUrl } from '@angular/platform-browser';
import { Avis } from 'src/models/Avis';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-scorebadage',
  templateUrl: './scorebadage.component.html',
  styleUrls: ['./scorebadage.component.css']
})
export class ScorebadageComponent {
  pageSize: number = 10;
  pageIndex: number = 0;
  totalPages: number = 0; 
  paginatedUtilisateurs: any[] = [];
  totalAvisCount: number = 0;
  totalItems: number = 0;
  utilisateursScores: any[] = [];
  avis: Avis[] = [];
  selectedBadge: string = '';
  scoreMap: Map<number, number> = new Map();
  user: any;
  filteredUtilisateurs: any[] = [];
  profileImageUrl: SafeUrl | null = null;
  avisList: Avis[] = [];
  paginatedAvis: Avis[] = [];
  page: number = 1;
  constructor(
    private readonly fileservice: FileService,
    private readonly cdr: ChangeDetectorRef,
    private readonly router: Router,
    private readonly avisService: AvisService,



  ) {


  }
  ngOnInit(): void {
  this.paginateUtilisateurs();
    this.loadUserData();
    this.loadUtilisateurScores();
    
   }


  loadUserData(): void {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      console.error("Aucun token trouvé !");
      return;
    }

    try {
      const decodedToken: any = jwtDecode(token);

      if (!decodedToken.id) {
        console.error("L'ID utilisateur est introuvable dans le token !");
        return;
      }

      this.user = decodedToken;
      if (this.user.image) {
        this.loadProfileImagee(this.user.image);
      }
      
      else {
        console.warn("Aucune image trouvée dans le token !");
      }




    } catch (error) {
      console.error("Erreur lors du décodage du token :", error);
    }
  }

  loadUtilisateurScores(): void {
    this.avisService.getScoresMoyens().subscribe({
      next: (data) => {
        const loadingPromises = data.map((user) => {
          return new Promise<any>((resolve) => {
            if (user.image) {
              this.fileservice.getImage(user.image).subscribe({
                next: (imageBlob) => {
                  const imageUrl = URL.createObjectURL(imageBlob);
                  resolve({ ...user, imageUrl: imageUrl });
                },
                error: () => {
                  resolve({ ...user, imageUrl: 'assets/images/user.png' });
                }
              });
            } else {
              resolve({ ...user, imageUrl: 'assets/images/user.png' });
            }
          });
        });
  
        Promise.all(loadingPromises).then((utilisateurs) => {
          this.utilisateursScores = utilisateurs;
          this.totalItems = utilisateurs.length;
          this.filterUtilisateursByBadge();
          this.paginateUtilisateurs();
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        console.error("Erreur lors du chargement des scores :", err);
      }
    });
  }
  
  logout(): void {

    localStorage.removeItem('accessToken')
    this.router.navigate(['/Front']);
  }


  loadProfileImagee(imagePath: string): void {
    if (!imagePath) {
      this.profileImageUrl = 'assets/images/user.png';
      return;
    }

    this.fileservice.getImage(imagePath).subscribe({
      next: (imageBlob) => {
        const objectURL = URL.createObjectURL(imageBlob);
        this.profileImageUrl = objectURL;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Erreur lors du chargement de l'image :", err);
        this.profileImageUrl = 'assets/images/user.png';
      }
    });
  }
  getBadgeClass(badge: string): string {
    switch (badge) {
      case 'Superstar':
        return 'badge-superstar icon-star';
      case 'Excellent':
        return 'badge-excellent icon-medal';
      case 'Bon':
        return 'badge-bon icon-thumbs-up';
      case 'Moyenne':
        return 'badge-moyenne icon-trophy';
      case 'Faible':
        return 'badge-faible icon-sad-tear';
      default:
        return '';
    }
  }
  filterUtilisateursByBadge() {
    if (this.selectedBadge) {
      this.filteredUtilisateurs = this.utilisateursScores.filter(
        (utilisateur) => utilisateur.badge === this.selectedBadge
      );
    } else {
      this.filteredUtilisateurs = [...this.utilisateursScores];
    }
    this.pageIndex = 0; 
    this.paginateUtilisateurs();
    this.cdr.detectChanges(); 
  }
  
  paginateUtilisateurs(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedUtilisateurs = this.filteredUtilisateurs.slice(startIndex, endIndex);
  }

  
 



  pageChanged(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.paginateUtilisateurs();
  }


  changePage(newPage: number): void {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.page = newPage;
      this.paginateUtilisateurs();
    }
  }

  onBadgeSelectionChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    if (selectElement) {
      const selectedBadge = selectElement.value;
      this.selectedBadge = selectedBadge;
      this.filterUtilisateursByBadge(); 
    }
  }
   handleDropdownKey(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      (event.target as HTMLElement).click();
    }
  }
  

}
