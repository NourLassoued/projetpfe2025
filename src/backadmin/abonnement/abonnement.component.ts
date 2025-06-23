import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { AbonmmentserviceService } from 'src/app/service/abonmmentservice.service';
import { FileService } from 'src/app/service/file.service';
import { PaymentService } from 'src/app/service/payment.service';
import { UtilisateurService } from 'src/app/service/utilisateur.service';
import { Abonnement } from 'src/models/Abonnement ';
import { TypeAbonnement } from 'src/models/TypeAbonnement';

@Component({
  selector: 'app-abonnement',
  templateUrl: './abonnement.component.html',
  styleUrls: ['./abonnement.component.css']
})
export class AbonnementComponent {
  currentPageExprimer: number = 1;
  abonnementsExprimerParPage: Abonnement[] = [];
  pageExprimer: number = 1;
  pageSizeExprimer: number = 5;
  pageSizeAbonnement = 10;
  currentPageAbonnement = 1;
  totalPagesAbonnement = 1;


  abonnements: any[] = [];


  utilisateursEnAttentePage: any[] = [];
  typeAbonnementValues = Object.values(TypeAbonnement);
  typeFiltre: TypeAbonnement | null = null
  user: any;
  profileImageUrl: string | null = null;
  utilisateursEnAttente: any[] = [];
  abonnementsActifs: Abonnement[] = [];
  abonnementsExprimer: Abonnement[] = [];
  pageSize = 10;
  currentPage = 1;
  totalPages = 1;
  constructor(
    private readonly utilisateurService: UtilisateurService,
    private readonly fileservice: FileService,
    private readonly abonnementService: AbonmmentserviceService,

    private readonly cdr: ChangeDetectorRef,
    private readonly paymentService: PaymentService,

    private readonly router: Router
  ) { }
  logout(): void {
    localStorage.removeItem('accessToken');
    this.router.navigate(['/Front']);
  }
  ngOnInit(): void {
    this.setupPagination();
    this.loadAbonnementsExprimer();
    this.loadAbonnementsActifs();
    const token = localStorage.getItem('accessToken');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      this.user = decodedToken;
      if (this.user.image) {
        this.loadProfileImagee(this.user.image);

      }
    } else {
      console.warn('Aucun token trouvé !');
    }

    this.loadUserData();
    this.loadUtilisateursEnAttente();
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

    } catch (error) {
      console.error('Erreur lors du décodage du token :', error);
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
  loadUtilisateursEnAttente(): void {
    this.utilisateurService.getUtilisateursEnAttenteEntrepriseOuPrestataire()
      .subscribe({
        next: (utilisateurs) => {
          this.utilisateursEnAttente = utilisateurs;
          this.utilisateursEnAttente.forEach((prestataire) => {
            this.loadProfileImage(prestataire);
            this.setupPagination();
          });
          this.cdr.detectChanges();

        },
        error: (err) => {
          console.error('Erreur lors du chargement des utilisateurs en attente :', err);
        }
      });

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
  envoyerEmailBienvenue(email: string): void {
    this.paymentService.testEnvoyerEmailBienvenue(email).subscribe({
      next: (response) => {

      },
      error: (err) => {
        console.error('Erreur lors de l\'envoi de l\'email :', err);
      }
    });
  }
  loadAbonnementsActifs(): void {
    this.abonnementService.getAbonnementsActifs().subscribe({
      next: (abonnements) => {
        this.abonnementsActifs = abonnements;

        this.abonnementsActifs.forEach((abonnement) => {
          const utilisateur = abonnement.utilisateur;
          if (utilisateur && utilisateur.image) {
            this.loadProfileImage(abonnement);
            const imagePath = utilisateur.image;
            this.fileservice.getImage(imagePath).subscribe({
              next: (imageBlob) => {
                const objectURL = URL.createObjectURL(imageBlob);
                utilisateur.image = objectURL;
              },
              error: () => {
                utilisateur.image = 'assets/images/user.png';
              },
            });
          } else {
            console.warn(`Aucune image pour l'utilisateur : ${utilisateur?.nom ?? 'Inconnu'}`);
          }
        });

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des abonnements actifs :', err);
      }
    });
  }
  setupPagination() {
    this.totalPages = Math.ceil(this.utilisateursEnAttente.length / this.pageSize);
    this.setPage(1);
  }

  setPage(page: number) {
    if (page < 1) page = 1;
    if (page > this.totalPages) page = this.totalPages;
    this.currentPage = page;

    const start = (page - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.utilisateursEnAttentePage = this.utilisateursEnAttente.slice(start, end);
  }
  get abonnementsFiltresPage(): Abonnement[] {
    let filtered = this.typeFiltre
      ? this.abonnementsActifs.filter(a => a.typeAbonnement === this.typeFiltre)
      : this.abonnementsActifs;

    const startIndex = (this.currentPageAbonnement - 1) * this.pageSizeAbonnement;
    return filtered.slice(startIndex, startIndex + this.pageSizeAbonnement);
  }

  setupPaginationAbonnements(): void {
    const filteredLength = this.typeFiltre
      ? this.abonnementsActifs.filter(a => a.typeAbonnement === this.typeFiltre).length
      : this.abonnementsActifs.length;

    this.totalPagesAbonnement = Math.ceil(filteredLength / this.pageSizeAbonnement);
    this.setPageAbonnement(1);
  }
  setPageAbonnement(page: number): void {
    if (page < 1) page = 1;
    if (page > this.totalPagesAbonnement) page = this.totalPagesAbonnement;
    this.currentPageAbonnement = page;
  }
  setTypeFiltre(value: TypeAbonnement | null): void {
    this.typeFiltre = value;
    this.currentPageAbonnement = 1;
    this.setupPaginationAbonnements();
  }




  loadAbonnementsExprimer(): void {
    this.abonnementService.getAbonnementsExprimer().subscribe({
      next: (abonnements) => {
        this.abonnementsExprimer = abonnements;

        this.abonnementsExprimer.forEach((abonnement) => {
          const utilisateur = abonnement.utilisateur;
          if (utilisateur && utilisateur.image) {
            this.loadProfileImage(abonnement);

            const imagePath = utilisateur.image;
            this.fileservice.getImage(imagePath).subscribe({
              next: (imageBlob) => {
                const objectURL = URL.createObjectURL(imageBlob);
                utilisateur.image = objectURL;
              },
              error: () => {
                utilisateur.image = 'assets/images/user.png';
              },
            });
          } else {
            console.warn(`Aucune image pour l'utilisateur : ${utilisateur?.nom ?? 'Inconnu'}`);
          }
        });
        this.setPageExprimer(1);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des abonnements exprimés :', err);
      }
    });
  }
  get totalPagesExprimer(): number {
    return Math.ceil(this.abonnementsExprimer.length / this.pageSizeExprimer);
  }
  setPageExprimer(page: number): void {
    if (page < 1) page = 1;
    if (page > this.totalPagesExprimer) page = this.totalPagesExprimer;
    this.pageExprimer = page;

    const start = (page - 1) * this.pageSizeExprimer;
    const end = start + this.pageSizeExprimer;
    this.abonnementsExprimerParPage = this.abonnementsExprimer.slice(start, end);
  }

  handleDropdownKey(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      (event.target as HTMLElement).click();
    }
  }
}
