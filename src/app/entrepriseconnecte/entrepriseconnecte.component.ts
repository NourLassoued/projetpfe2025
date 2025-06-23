import { ChangeDetectorRef, Component } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { Avis } from 'src/models/Avis';
import { Utilisateur } from 'src/models/Utilisateur';
import { AvisService } from '../service/avis.service';
import { FileService } from '../service/file.service';
import { jwtDecode } from 'jwt-decode';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ActivatedRoute } from '@angular/router';
import { Reservation } from 'src/models/Reservation';
import { UtilisateurService } from '../service/utilisateur.service';
import { ReservationService } from '../service/reservation.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-entrepriseconnecte',
  templateUrl: './entrepriseconnecte.component.html',
  styleUrls: ['./entrepriseconnecte.component.css']
})
export class EntrepriseconnecteComponent {
  showNotification = false;
  profileImage: string | null = null;
  user: any;
  profileImageUrl: SafeUrl | null = null;
  reservation: Reservation = new Reservation();
  user1: Utilisateur = { servicesOfferts: [] };

  utilisateurConnecteId!: number;
  userId: number | undefined;
  prestataireId!: number;
  utilisateurId!: number;
  demandeId!: number;
  avisAffiches: any[] = [];
  indexDebut: number = 0;
  avisParPage: number = 3;
  avisList: Avis[] = [];
  userRole: string = '';
  contenuMessage: string = '';
  utilisateurConnecte: any;
  score: number = 0;
  constructor(private readonly fileService: FileService,

    private readonly activatedRoute: ActivatedRoute,
    private readonly utilisateurservice: UtilisateurService,
    private readonly reservationService: ReservationService,
    private readonly cdr: ChangeDetectorRef,
    private readonly avisService: AvisService,
    private readonly toastr: ToastrService,
    private readonly aviservice: AvisService,


  ) { }


  ngOnInit(): void {




    this.loadUserData();


    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.prestataireId = +id;
        this.loadAvis(this.prestataireId);
      } else {
        console.error("ID du prestataire manquant dans les paramètres de l'URL !");
      }
    });


    this.activatedRoute.queryParamMap.subscribe(params => {
      this.utilisateurId = +params.get('utilisateurId')!;
      this.demandeId = +params.get('demandeId')!;
    });


    this.activatedRoute.paramMap.subscribe(params => {
      const userIdParam = params.get('id');

      if (userIdParam) {
        this.userId = +userIdParam;


        this.utilisateurservice.getById(this.userId).subscribe({
          next: (userData: any) => {
            this.user = userData;

            if (this.user?.image) {
              this.loadProfileImage(this.user.image);
            }

            if (this.userId !== undefined) {
              this.aviservice.getScoreMoyen(this.userId).subscribe({
                next: (score: number) => {
                  this.score = score;
                },
                error: (error: any) => {
                  console.error("Erreur lors de la récupération du score :", error);
                }
              });
            }

            if (userData.services && Array.isArray(userData.services)) {
              this.user.servicesOfferts = userData.services.map((service: string) => ({
                idservice: null,
                nomservice: service.replace(/[\r\n]+/g, '').trim()
              }));
            } else {
              this.user.servicesOfferts = [];
            }

            if (userData.disponibilites && Array.isArray(userData.disponibilites)) {
              this.user.disponibilites = userData.disponibilites.map((dispo: any, index: number) => ({
                id: dispo.id ?? index,
                jour: dispo.jour,
                heureDebut: dispo.heureDebut,
                heureFin: dispo.heureFin
              })) ?? [];
            } else {
              this.user.disponibilites = [];
            }
          },
          error: (error: any) => {
            console.error("Erreur lors de la récupération de l'utilisateur :", error);
          }
        });
      }
    });
  }


  mettreAJourAffichage() {
    this.avisAffiches = this.avisList.slice(this.indexDebut, this.indexDebut + this.avisParPage);
  }

  suivant() {
    if (this.indexDebut + this.avisParPage < this.avisList.length) {
      this.indexDebut += this.avisParPage;
      this.mettreAJourAffichage();
    }
  }

  precedent() {
    if (this.indexDebut > 0) {
      this.indexDebut -= this.avisParPage;
      this.mettreAJourAffichage();
    }

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


      this.utilisateurConnecte = decodedToken;
      this.utilisateurConnecteId = decodedToken.id;








    } catch (error) {
      console.error("Erreur lors du décodage du token :", error);
    }
  }

  afficherNumero() {
    this.showNotification = true;
  }
  getAverageRating(): number {
    return this.score;
  }

  closeNotification() {
    this.showNotification = false;
  }

  loadProfileImage(filename: string, index: number = 0, type: 'utilisateur' | 'user' = 'user'): void {
    this.fileService.getImage(filename).subscribe({
      next: (imageBlob) => {
        const imageUrl = URL.createObjectURL(imageBlob);

        if (type === 'utilisateur') {

          const utilisateur = this.avisList?.[index]?.utilisateur;

          if (utilisateur) {
            utilisateur.image = imageUrl;
          } else {
            console.error('Utilisateur à l\'index ' + index + ' ou utilisateur est undefined.');
          }
        } else if (type === 'user') {
          this.profileImageUrl = imageUrl;
        }
      },
      error: (error) => {

      }
    });
  }

  loadAvis(prestataireId: number): void {

    if (!prestataireId) {
      console.error("ID du prestataire manquant !");
      return;
    }
    this.avisService.getAvisParprestatitr(prestataireId).subscribe({
      next: (avisdata) => {
        this.avisList = avisdata;

        this.avisList?.forEach((avis, index) => {

          if (avis.utilisateur?.image) {
            this.loadProfileImage(avis.utilisateur.image, index, 'utilisateur');
            this.mettreAJourAffichage();

          }
        });
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des avis:', error);
      }
    });
  }


  reserver(prestataireId: number) {
    if (!this.utilisateurId || !this.demandeId || !prestataireId) {
      this.toastr.error("Informations manquantes pour la réservation.", "Erreur");
      return;
    }


    this.reservation.dateReservation = new Date();


    this.reservationService.reserverPrestataire(this.utilisateurId, prestataireId, this.demandeId, this.reservation)
      .subscribe({
        next: (data) => {

          this.toastr.success("Réservation effectuée ! En attente de la réponse du prestataire."
            , "Succès");
        },
        error: (err) => {

          this.toastr.error("Échec de la réservation !", "Erreur");
        }
      });
  }

  getRatingCount(star: number): number {
    return this.avisList.filter((a) => a.note === star).length;
  }

  getRatingPercentage(star: number): number {
    const total = this.avisList.length;
    if (total === 0) return 0;
    return (this.getRatingCount(star) / total) * 100;
  }


  getTempsEcoule(date?: Date): string {
    if (!date) {
      return 'Date inconnue';
    }

    return formatDistanceToNow(date, { addSuffix: true, locale: fr });
  }


}
