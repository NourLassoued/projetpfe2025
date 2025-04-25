import {
  ChangeDetectorRef,
  Component,
  DoCheck,
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
export class UserComponent implements OnInit, DoCheck {
  prestataires: Utilisateur[] = [];
  @ViewChild('calendarIcon') calendarIcon!: ElementRef;
  entreprises: Utilisateur[] = [];
  selectedPrestataire: Utilisateur | null = null;
  profileImage: string | null = null;
  user: any;
  profileImageUrl: SafeUrl | null = null;
  utilisateursParticuliers: Utilisateur[] = [];
  utilisateursEntreprises: Utilisateur[] = [];

  image: SafeUrl | null = null;
  sanitizer: any;

  editColumn: string | null = null;
  editRowId: number | null = null;
  newValue: any = '';

  constructor(
    private utilisateurService: UtilisateurService,
    public dialog: MatDialog,
    private fileservice: FileService,

    private cdr: ChangeDetectorRef,
    private router: Router
  ) { }
  ngDoCheck() { }
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
    this.utilisateurService.getPrestataires().subscribe(
      (data) => {
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

        this.prestataires.forEach((prestataire) => {
          if (prestataire.image) {
            this.loadProfileImage(prestataire);
          }
        });
      },
      (error) => {
        console.error('Erreur lors du chargement des prestataires', error);
      }
    );
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
      },
      (error) => {
        console.error('Erreur lors du chargement des particuliers', error);
      }
    );
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
        });
      },
      (error) => {
        console.error('Erreur lors du chargement des entreprises', error);
      }
    );
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
}
