import { ChangeDetectorRef, Component } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Utilisateur } from 'src/models/Utilisateur';
import { FileService } from '../service/file.service';
import { ActivatedRoute } from '@angular/router';
import { UtilisateurService } from '../service/utilisateur.service';
import { jwtDecode } from 'jwt-decode';
import { ReservationService } from '../service/reservation.service';
import { ToastrService } from 'ngx-toastr';
import { Reservation } from 'src/models/Reservation';
import { AvisService } from '../service/avis.service';

import { fr } from 'date-fns/locale'; // Pour afficher en français
import { Avis } from 'src/models/Avis';

import { formatDistanceToNow, parseISO } from 'date-fns';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent {
    showNotification = false;
    profileImage: string | null = null; 
    user: any;
    profileImageUrl: SafeUrl | null = null; 
    reservation: Reservation = new Reservation();
  user1: Utilisateur = { servicesOfferts: [] };
  userId: number | undefined;
  prestataireId!: number;
  utilisateurId!: number;
  demandeId!: number;
      avisAffiches: any[] = [];
  indexDebut: number = 0;
  avisParPage: number = 3;
   avisList: Avis[] = []; 
  constructor(private fileService: FileService, 
  private sanitizer: DomSanitizer,
  private activatedRoute: ActivatedRoute,
  private utilisateurservice:UtilisateurService ,
  private reservationService: ReservationService,
  private cdr: ChangeDetectorRef,
  private avisService: AvisService,
    private toastr: ToastrService){}

      ngOnInit(): void {
        this.loadUserData();

        this.activatedRoute.paramMap.subscribe(params => {
          this.prestataireId = +params.get('prestataireId')!; 
        });
        
        this.activatedRoute.queryParamMap.subscribe(params => {
          this.utilisateurId = +params.get('utilisateurId')!;
          this.demandeId = +params.get('demandeId')!; 
          
        });
        
        this.activatedRoute.paramMap.subscribe(params => {
          const userIdParam = params.get('id');  
      
          if (userIdParam) {
            this.userId = +userIdParam;
      
          
            this.utilisateurservice.getById(this.userId).subscribe(
              (userData: any) => {
                this.user = userData;
                if (this.user?.image) {
                  this.loadProfileImage(this.user.image);  
                
                }
      
               
                if (userData.services && Array.isArray(userData.services)) {
                  this.user.servicesOfferts = userData.services.map((service: string) => ({
                    idservice: null,
                    nomservice: service.replace(/[\r\n]+/g, '').trim()
                  }));
                } else {
                  console.warn("Aucun service trouvé !");
                  this.user.servicesOfferts = [];
                }
      
               
                if (userData.disponibilites && Array.isArray(userData.disponibilites)) {
                  this.user.disponibilites = userData.disponibilites.map((dispo: any, index: number) => ({
                    id: dispo.id ?? index,
                    jour: dispo.jour,
                    heureDebut: dispo.heureDebut,
                    heureFin: dispo.heureFin
                  })) || [];
                } else {
                  this.user.disponibilites = [];
                }
      
             
               
              },
              (error) => {
                console.error("Erreur lors de la récupération de l'utilisateur :", error);
              }
            );
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
    
          this.user = decodedToken;
          if (this.user.image) {
            this.loadProfileImage(this.user.image);
        
          } 
        
          else {
            console.warn("Aucune image trouvée dans le token !");
          }
    
    
          
    
        } catch (error) {
          console.error("Erreur lors du décodage du token :", error);
        }
      }
     
      afficherNumero() {
        this.showNotification = true;
      }
      
      closeNotification() {
        this.showNotification = false;
      }

      loadProfileImage(filename: string, index: number = 0, type: 'utilisateur' | 'user' = 'user'): void {
        this.fileService.getImage(filename).subscribe(
          (imageBlob) => {
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
          (error) => {
            console.error('Erreur de chargement de l\'image', error);
          }
        );
      }
      
      loadAvis(userId: number): void {
        this.avisService.getAvisParprestatitr(userId).subscribe(
          (avisdata) => {
            this.avisList = avisdata;
      
            this.avisList?.forEach((avis, index) => {
              // Vérification que l'utilisateur et l'image existent
              if (avis.utilisateur?.image) {
                this.loadProfileImage(avis.utilisateur.image, index, 'utilisateur');
                this.mettreAJourAffichage();
                console.log(`Image de l'utilisateur à l'index ${index}:`, avis.utilisateur.image);
              } else {
                console.log(`Utilisateur à l'index ${index} est undefined ou n'a pas d'image`);
              }
            });
            this.cdr.detectChanges();
          },
          (error) => {
            console.error('Erreur lors de la récupération des avis:', error);
          }
        );
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
        console.error("Erreur lors de la réservation :", err);
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
              
              getAverageRating(): string {
                const total = this.avisList.length;
                if (total === 0) return '0.0';
                const sum = this.avisList.reduce((acc, avis) => acc + (avis.note ?? 0), 0);
                return (sum / total).toFixed(1);
              }
                getTempsEcoule(date?: Date): string {
                  if (!date) {
                    return 'Date inconnue'; 
                  }
                
                  return formatDistanceToNow(date, { addSuffix: true, locale: fr });
                }
              

    }