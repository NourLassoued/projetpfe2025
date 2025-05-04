import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Avis } from 'src/models/Avis';
import { Utilisateur } from 'src/models/Utilisateur';
import { FileService } from '../service/file.service';
import { AvisService } from '../service/avis.service';
import { jwtDecode } from 'jwt-decode';
import { formatDistanceToNow } from 'date-fns';
import { fr, th } from 'date-fns/locale';
import { ActivatedRoute } from '@angular/router';
import { UserRole } from 'src/models/UserRole';
import { UtilisateurService } from '../service/utilisateur.service';
import { ReservationService } from '../service/reservation.service';
import { MessageService } from '../service/message.service';
import { ToastrService } from 'ngx-toastr';
import { Reservation } from 'src/models/Reservation';
import { co } from '@fullcalendar/core/internal-common';

@Component({
  selector: 'app-consulterentrprise',
  templateUrl: './consulterentrprise.component.html',
  styleUrls: ['./consulterentrprise.component.css']
})
export class ConsulterentrpriseComponent implements OnInit {
   showNotification = false;
     profileImage: string | null = null; 
     user: any;
     profileImageUrl: SafeUrl | null = null; 
     avis: Avis = {
      note: 0,
      commentaire: ''
    };
    
   user1: Utilisateur = { servicesOfferts: [] };
   score: number = 0;
   showModal = false;
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
   constructor(private fileService: FileService, 
  
   private activatedRoute: ActivatedRoute,
   private utilisateurservice:UtilisateurService ,
  
   private cdr: ChangeDetectorRef,
   private avisService: AvisService,
     private toastr: ToastrService,
     private messageService: MessageService,){}
 
     ngOnInit(): void {
  
       this.activatedRoute.paramMap.subscribe(params => {
         const id = params.get('id');
         if (id) {
           this.prestataireId = +id; 
         
       
           this.loadAvis(this.prestataireId); 
         } else {
           console.error("ID du prestataire manquant dans les paramètres de l'URL !");
         }
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
                 this.user.servicesOfferts = [];
               }
     
          
             },
             (error) => {
               console.error("Erreur lors de la récupération de l'utilisateur :", error);
             }
           );
         }
       });
     }
     
       getAverageRating(): number {
         return this.score; 
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
             
           }
         );
       }
       
       loadAvis(prestataireId: number): void {
 
         if (!prestataireId) {
           console.error("ID du prestataire manquant !");
           return;
         }
         this.avisService.getAvisParprestatitr(prestataireId).subscribe(
           (avisdata) => {
             this.avisList = avisdata;
       
             this.avisList?.forEach((avis, index) => {
            
               if (avis.utilisateur?.image) {
                 this.loadProfileImage(avis.utilisateur.image, index, 'utilisateur');
                 this.mettreAJourAffichage();
                 
               } else {
                
               }
             });
             this.avisService.getScoreMoyen(this.prestataireId).subscribe(
               (score: number) => {
                 this.score = score; 
              
               },
               (error: any) => {
                 console.error("Erreur lors de la récupération du score :", error);
               }
             );
       
             this.cdr.detectChanges();
           },
           (error) => {
             console.error('Erreur lors de la récupération des avis:', error);
           }
         );
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
 
 
                 envoyerMessage(): void {
                  
                  if (!this.contenuMessage || !this.contenuMessage.trim()) {
                    this.toastr.error("Veuillez entrer un message avant de l'envoyer.", "Erreur");
                    return;
                  }
              
               
                  const token = localStorage.getItem('accessToken');
              
                  if (token) {
         
                    const decodedToken: any = jwtDecode(token);
                    this.utilisateurConnecteId = decodedToken.id;
                    this.userRole = decodedToken.role;
                   
              
              
                    if (!this.utilisateurConnecteId) {
                      this.toastr.error("ID utilisateur non valide dans le token", "Erreur");
                      return;
                    }
              
                    const sender = new Utilisateur();
                    sender.idUtilisateur = this.utilisateurConnecteId;
                    sender.role = this.userRole as UserRole;
              
                  
                    const receiver = new Utilisateur();
                    receiver.idUtilisateur = this.prestataireId;
                    receiver.role = UserRole.ENTREPRISE;
              
                    const message = {
                      sender: sender,
                      receiver: receiver,
                      content: this.contenuMessage,
                      timestamp: new Date(),
                      delivered: false,
                    };
              
                 
                    this.messageService.sendMessage(message).subscribe({
                      next: () => {
                        this.toastr.success("Message envoyé avec succès !", "Succès");
                        this.contenuMessage = '';  
                        this.showNotification = false;
                      },
                      error: (error) => {
                        console.error("Erreur lors de l'envoi du message:", error);
                        this.toastr.error("Échec de l'envoi du message !", "Erreur");
                      },
                    });
                  } else {
                    console.error("Aucun token trouvé dans localStorage !");
                    this.toastr.error("Token d'authentification manquant", "Erreur");
                  }
                }
                ouvrirModal(reservation: any): void {
             
                  this.avis = {
                    note: 0,
                    commentaire: ''
                  };
                  this.showModal = true;
                
                 
          
                }
                closeModal(): void {
                  this.showModal = false;
                }
                envoyerAvis(): void {
                  const idUtilisateur = this.userId;
                  const idAvisUtilisateur = this.user.this.prestataire?.idUtilisateur;
                
                
                
                 
                  if (
                    idUtilisateur == null ||
                    idAvisUtilisateur == null ||
                    this.avis.note == null ||
                    this.avis.note < 1 || this.avis.note > 5 ||
                    !this.avis.commentaire || this.avis.commentaire.trim() === ''
                  ) {
                    this.toastr.warning("Tous les champs sont requis et la note doit être entre 1 et 5 !");
                    return;
                  }
                
                 
                  this.utilisateurservice.donnerAvis(idUtilisateur, idAvisUtilisateur, this.avis)
                    .subscribe({
                      next: (response) => {
                        this.toastr.success('Avis envoyé avec succès !');
                        this.showModal = false;
                
                       
                        this.avis = {
                          note: 0,
                          commentaire: ''
                        };
                      },
                      error: (error) => {
                        this.toastr.error("Erreur lors de l'envoi de l'avis !");
                        console.error(error);
                      }
                    });
                }
                setNote(note: number): void {
                  this.avis.note = note;  
                }
                
              }      
            
          
          
          
              