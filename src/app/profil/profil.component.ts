import { Component } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Utilisateur } from 'src/models/Utilisateur';
import { FileService } from '../service/file.service';
import { ActivatedRoute } from '@angular/router';
import { UtilisateurService } from '../service/utilisateur.service';
import { jwtDecode } from 'jwt-decode';
import { ReservationService } from '../service/reservation.service';
import { ToastrService } from 'ngx-toastr';
import { Reservation } from 'src/models/Reservation';

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
  constructor(private fileService: FileService, 
  private sanitizer: DomSanitizer,
  private activatedRoute: ActivatedRoute,
  private utilisateurservice:UtilisateurService ,
  private reservationService: ReservationService,
    private toastr: ToastrService){}

      ngOnInit(): void {
        this.loadUserData();

        this.activatedRoute.paramMap.subscribe(params => {
          this.prestataireId = +params.get('prestataireId')!; // ID Prestataire
        });
        
        this.activatedRoute.queryParamMap.subscribe(params => {
          this.utilisateurId = +params.get('utilisateurId')!; // ID Utilisateur
          this.demandeId = +params.get('demandeId')!; // ID Demande
          console.log("Prestataire ID:", this.prestataireId);
          console.log("Utilisateur ID:", this.utilisateurId);
          console.log("Demande ID:", this.demandeId);
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

      loadProfileImage(filename: string): void {
        this.fileService.getImage(filename).subscribe({
          next: (imageBlob) => {
            const objectURL = URL.createObjectURL(imageBlob); 
            this.profileImageUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
          },
          error: (err) => {
            console.error('Erreur de chargement de l\'image', err);
            this.profileImageUrl = null; 
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

    }