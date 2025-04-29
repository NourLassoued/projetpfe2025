import { ChangeDetectorRef, Component } from '@angular/core';

import { SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { ToastrService } from 'ngx-toastr';
import { AvisService } from 'src/app/service/avis.service';

import { FileService } from 'src/app/service/file.service';

import { Avis } from 'src/models/Avis';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-espaceavis',
  templateUrl: './espaceavis.component.html',
  styleUrls: ['./espaceavis.component.css']
})
export class EspaceavisComponent {

  sortField: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  searchTerm: string = '';

  totalAvisCount: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;
  displayedColumns: string[] = ['commentaire', 'note', 'date', 'prestataire', 'particulier', 'actions'];
  avisList: Avis[] = [];
  paginatedAvis: Avis[] = [];
  filteredAvisList: Avis[] = [];

  page: number = 1;
  itemsPerPage: number = 3;
  totalPages: number = 0;

  user: any;
  profileImageUrl: SafeUrl | null = null;
  constructor(
    private fileservice: FileService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private avisService: AvisService,
    private toastr: ToastrService


  ) {


  }
  ngOnInit(): void {

    this.avisService.getAllAvis().subscribe(data => {
      this.avisList = data;
      this.totalAvisCount = this.avisList.length;
      this.totalPages = Math.ceil(this.totalAvisCount / this.itemsPerPage);
      this.filteredAvisList = this.avisList; // au début, pas de filtre


      this.paginate();
      this.loadUserData();
    });
  }

  paginate(): void {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedAvis = this.filteredAvisList.slice(start, end);
  }
  

  pageChanged(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.paginate();
  }


  changePage(newPage: number): void {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.page = newPage;
      this.paginate();
    }
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
      if (this.user.telephoneNumber) {

      }
      else {
        console.warn("Aucune image trouvée dans le token !");
      }




    } catch (error) {
      console.error("Erreur lors du décodage du token :", error);
    }
  }
  logout(): void {

    localStorage.removeItem('accessToken')
    this.router.navigate(['/Front']);
  }
  deleteAvis(idAvis: number): void {
    this.avisService.deleteAvis(idAvis).subscribe({
      next: () => {

        this.avisList = this.avisList.filter(avis => avis.idAvis !== idAvis);


        this.toastr.success('Avis supprimé avec succès', 'Succès');
        this.paginate();
      },
      error: (err) => {
        console.error('Erreur lors de la suppression de l’avis :', err);
        this.toastr.error("Une erreur s'est produite lors de la suppression", 'Erreur');
      }
    });
  }

  getShortDescription(commentaire?: string): string {
    return commentaire ? commentaire.substring(0, 100) + '...' : '';
  }
  toggleCommaintre(avis: Avis): void {
    avis.showFullcommentaire = !avis.showFullcommentaire;
  }
  getStarsArray(note: number): number[] {
    return Array(note).fill(0);
  }
  sortBy(field: string): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }

    this.paginatedAvis = this.paginatedAvis.slice().sort((a, b) => {
      const aValue = this.getValue(a, field);
      const bValue = this.getValue(b, field);

      if (aValue == null) return 1;
      if (bValue == null) return -1;

      if (this.sortDirection === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });
  }

  getValue(obj: any, field: string): any {

    if (field === 'dateAvis') return new Date(obj.dateAvis);
    if (field === 'note') return obj.note;
    return obj[field];
  }
  filterAvis(): void {
    const term = this.searchTerm.trim().toLowerCase();
    
    this.filteredAvisList = this.avisList.filter(avis =>
      avis.utilisateur?.nom?.toLowerCase().includes(term) ||
      avis.avisUtilisateur?.nom?.toLowerCase().includes(term)
    );
    
    this.totalAvisCount = this.filteredAvisList.length;
    this.pageIndex = 0; 
    this.paginate();
  }
  
  
}