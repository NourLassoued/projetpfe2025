import { ChangeDetectorRef, Component } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Utilisateur } from 'src/models/Utilisateur';
import { FileService } from '../service/file.service';
import { jwtDecode } from 'jwt-decode';
import { AvisService } from '../service/avis.service';
import { Avis } from 'src/models/Avis';
import { fr } from 'date-fns/locale'; 

import { formatDistanceToNow, parseISO } from 'date-fns';
@Component({
  selector: 'app-profiletrprise',
  templateUrl: './profiletrprise.component.html',
  styleUrls: ['./profiletrprise.component.css']
})
export class ProfiletrpriseComponent {
  indexDebut: number = 0;
  avisParPage: number = 3;
   avisList: Avis[] = []; 
   avisAffiches: any[] = [];
   showNotification = false;
    profileImage: string | null = null; 
    user: any;
      profileImageUrl: SafeUrl | null = null; 
  
   user1: Utilisateur = { servicesOfferts: [] };
     
    constructor(private fileService: FileService, 
    

          private cdr: ChangeDetectorRef,
     private avisService: AvisService ,){}
    
     
    ngOnInit(): void {
      this.loadUserData();
      this.mettreAJourAffichage();
      const token = localStorage.getItem('accessToken');
      if (token) {
        const decodedToken: any = jwtDecode(token);
       
    
        if (decodedToken.services && Array.isArray(decodedToken.services)) {
          this.user1.servicesOfferts = decodedToken.services.map((service: string) => ({
            idservice: null,  
            nomservice: service.replace(/[\r\n]+/g, '').trim() 
          }));
         
        } else {
          console.warn(" Aucun service trouvé dans le token !");
        }
        
          
          
       
  
    }
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
  mettreAJourAffichage() {
    this.avisAffiches = this.avisList.slice(this.indexDebut, this.indexDebut + this.avisParPage);
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
        if (this.user.telephoneNumber) {
       
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
        
          if (avis.utilisateur?.image) {
            this.loadProfileImage(avis.utilisateur.image, index, 'utilisateur');
            this.mettreAJourAffichage();
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
