import {
  ChangeDetectorRef,
  Component,

  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Utilisateur } from 'src/models/Utilisateur';
import { UtilisateurService } from '../../app/service/utilisateur.service';
import { MatDialog } from '@angular/material/dialog';
import { FileService } from '../../app/service/file.service';
import { SafeUrl } from '@angular/platform-browser';

import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  searchNomPrestataire: string = '';
  allPrestataires: any[] = [];

  allUtilisateursParticuliers: any[] = [];
  utilisateursParticuliers: any[] = [];
  pagedUtilisateursParticuliers: any[] = [];
  searchNomUtilisateur: string = '';
  currentPageParticuliers: number = 1;
  pageSizeParticuliers: number = 10;
  totalPagesParticuliers: number = 1;

  earchNomUtilisateur: string = '';
  filteredEntreprises: any[] = [];



  prestataires: any[] = [];
  pagedPrestataires: any[] = [];
  currentPage = 1;
  pageSize = 7;
  totalPages = 0;
  searchNomEntreprise = '';
  pagedEntreprises: any[] = [];
  searchKeyword: string = '';

  @ViewChild('calendarIcon') calendarIcon!: ElementRef;
  entreprises: Utilisateur[] = [];
  selectedPrestataire: Utilisateur | null = null;
  profileImage: string | null = null;
  user: any;
  profileImageUrl: SafeUrl | null = null;
  utilisateursEntreprises: Utilisateur[] = [];


  currentPageEntreprises = 1;
  pageSizeEntreprises = 5;
  totalPagesEntreprises = 0;
  image: SafeUrl | null = null;
  sanitizer: any;

  editColumn: string | null = null;
  editRowId: number | null = null;
  newValue: any = '';

  constructor(
    private readonly utilisateurService: UtilisateurService,
    public readonly dialog: MatDialog,
    private readonly fileservice: FileService,

    private readonly cdr: ChangeDetectorRef,
    private readonly router: Router
  ) { }

  logout(): void {
    localStorage.removeItem('accessToken');
    this.router.navigate(['/Front']);
  }
  ngOnInit(): void {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      this.user = decodedToken;
      if (this.user.image) {
        this.loadProfileImage(this.user.image);

      }
    } else {
      console.warn('Aucun token trouvé !');
    }
    this.getAllPrestataires();
    this.getAllParticuliers();
    this.getAllEntreprises();
    this.loadUserData();
  }

  getAllPrestataires(): void {
    this.utilisateurService.getPrestataires().subscribe({
      next: (data) => {
        this.prestataires = data.map((prestataire) => ({
          ...prestataire,
          disponibilites: prestataire.disponibilite || [],
          showFullDescription: false,
          servicesOfferts: prestataire.servicesOfferts
            ? prestataire.servicesOfferts.map((service) => ({
              ...service,
              nomservice: service.nomservice
                ? service.nomservice.replace(/[\r\n]+/g, '').trim()
                : '',
            }))
            : [],
          profileImageUrl: null,
          adresse: prestataire.adressee ? prestataire.adressee.governoate : '',
          doucument_CIN: prestataire.doucument_CIN,
          doucument_cv: prestataire.doucument_cv,
        }));
        this.allPrestataires = [...this.prestataires];

        this.prestataires.forEach((prestataire) => {
          if (prestataire.image) {
            this.loadProfileImage(prestataire);
          }
        });
        this.setPage(1);
        this.totalPages = Math.ceil(this.prestataires.length / this.pageSize);
        this.filterPrestatairesByNom();

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des prestataires', error);
      }
    });
  }
  filterPrestatairesByNom(): void {
    const search = this.searchNomPrestataire.toLowerCase();

    this.prestataires = this.allPrestataires.filter(prestataire =>
      prestataire.nom?.toLowerCase().includes(search)
    );

    this.totalPages = Math.ceil(this.prestataires.length / this.pageSize);
    this.setPage(1);
  }



  getShortDescription(description?: string): string {
    return description ? description.substring(0, 100) + '...' : '';
  }
  toggleDescription(prestataire: Utilisateur): void {
    prestataire.showFullDescription = !prestataire.showFullDescription;
  }
  loadProfileImage(prestataire: any): void {
    if (prestataire.image) {
      this.fileservice.getImage(prestataire.image).subscribe({
        next: (imageBlob) => {
          const objectURL = URL.createObjectURL(imageBlob);
          prestataire.image = objectURL;
        },
        error: () => {
          prestataire.image = 'assets/images/user.png';
        },
      });
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
      },
    });
  }

  showDisponibilites(prestataire: Utilisateur) {
    this.selectedPrestataire = prestataire;
  }

  closeDisponibilites() {
    this.selectedPrestataire = null;
  }
  downloadFile(filename: string): void {
    this.fileservice.getImage(filename).subscribe({
      next: (imageBlob) => {
        const objectURL = URL.createObjectURL(imageBlob);
        const link = document.createElement('a');
        link.href = objectURL;
        link.download = filename;
        link.click();
      },
      error: (err) => { },
    });
  }
  getAllParticuliers(): void {
    this.utilisateurService.getUtilisateursParticuliers().subscribe(
      (data) => {
        this.utilisateursParticuliers = data.map((particulier) => ({
          ...particulier,
          profileImageUrl: null,
        }));

        this.utilisateursParticuliers.forEach((particulier) => {
          this.loadProfileImage(particulier);
        });
        this.totalPagesParticuliers = Math.ceil(this.utilisateursParticuliers.length / this.pageSizeParticuliers);

        this.setPageParticuliers(1);
        this.allUtilisateursParticuliers = [...this.utilisateursParticuliers];
        this.filterUtilisateursByNom();
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Erreur lors du chargement des particuliers', error);
      }
    );
  }
  filterUtilisateursByNom(): void {
    const search = this.searchNomUtilisateur.toLowerCase();

    this.utilisateursParticuliers = this.allUtilisateursParticuliers.filter(utilisateur =>
      utilisateur.nom?.toLowerCase().includes(search)
    );

    this.totalPagesParticuliers = Math.ceil(this.utilisateursParticuliers.length / this.pageSizeParticuliers);

    this.setPageParticuliers(1);
  }
  setPageParticuliers(page: number): void {
    if (page < 1) page = 1;
    if (page > this.totalPagesParticuliers) page = this.totalPagesParticuliers;

    this.currentPageParticuliers = page;

    const startIndex = (page - 1) * this.pageSizeParticuliers;
    const endIndex = startIndex + this.pageSizeParticuliers;

    this.pagedUtilisateursParticuliers = this.utilisateursParticuliers.slice(startIndex, endIndex);
  }
  getAllEntreprises(): void {
    this.utilisateurService.getAllEntreprises().subscribe(
      (data) => {
        this.entreprises = data.map((entreprise) => ({
          ...entreprise,

          showFullDescription: false,
          servicesOfferts: entreprise.servicesOfferts
            ? entreprise.servicesOfferts.map((service) => ({
              ...service,
              nomservice: service.nomservice
                ? service.nomservice.replace(/[\r\n]+/g, '').trim()
                : '',
            }))
            : [],
          profileImageUrl: null,
          adresse: entreprise.adressee ? entreprise.adressee.governoate : '',
        }));

        this.entreprises.forEach((entreprise) => {
          if (entreprise.image) {
            this.loadProfileImage(entreprise);
          }
          this.filterUtilisateursByNom();

        });

        this.totalPagesEntreprises = Math.ceil(this.entreprises.length / this.pageSizeEntreprises);
        this.filteredEntreprises = [...this.entreprises];
        this.setPageEntreprises(1);

      },
      (error) => {
        console.error('Erreur lors du chargement des entreprises', error);
      }
    );
  }
  filterEntreprisesByNom(): void {
    const keyword = this.searchNomEntreprise?.toLowerCase().trim() ?? '';

    this.filteredEntreprises = this.entreprises.filter((entreprise) => {
      const nom = (entreprise.nom || '').toLowerCase();
      return nom.includes(keyword);
    });

    this.totalPagesEntreprises = Math.ceil(this.filteredEntreprises.length / this.pageSizeEntreprises);
    this.setPageEntreprises(1);
  }






  supprimerUtilisateur(id: number): void {
    this.utilisateurService.deleteUser(id).subscribe(
      () => {
        this.prestataires = this.prestataires.filter(
          (prestataire) => prestataire.idUtilisateur !== id
        );

        this.getAllEntreprises();
        this.getAllParticuliers();
        this.cdr.detectChanges();
      },
      (error) => {
        console.error("Erreur lors de la suppression de l'utilisateur", error);
      }
    );
  }
  startEditing(id: number, column: string, currentValue: any): void {
    this.editRowId = id;
    this.editColumn = column;
    this.newValue = currentValue;
  }
  updateUserInTable(id: number, column: string, newValue: any): void {
    this.utilisateurService.updateUser(id, { [column]: newValue }).subscribe(
      (response) => {
        const utilisateur = this.prestataires.find(
          (p) => p.idUtilisateur === id
        );
        if (utilisateur) {
          utilisateur[column] = newValue;
        }
        this.editColumn = null;
        this.editRowId = null;
      },
      (error) => {
        console.error("Erreur lors de la mise à jour de l'utilisateur", error);
      }
    );
  }
  loadUserData(): void {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      console.error('Aucun token trouvé !');
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
      } else {
        console.warn('Aucune image trouvée dans le token !');
      }
    } catch (error) {
      console.error('Erreur lors du décodage du token :', error);
    }
  }

  setPage(page: number) {
    if (page < 1) page = 1;
    if (page > this.totalPages) page = this.totalPages;

    this.currentPage = page;
    const startIndex = (page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedPrestataires = this.prestataires.slice(startIndex, endIndex);
  }

  setPageEntreprises(page: number): void {
    this.currentPageEntreprises = page;
    const start = (page - 1) * this.pageSizeEntreprises;
    const end = start + this.pageSizeEntreprises;
    this.pagedEntreprises = this.filteredEntreprises.slice(start, end);
  }


  onKeydownToggle(event: KeyboardEvent): void {
    event.preventDefault();
    const target = event.target as HTMLElement | null;
    if (target) {
      target.click();
    }
  }

  handleDropdownKey(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      (event.target as HTMLElement).click();
    }
  }
}
