import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FileService } from '../service/file.service';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { CategorieService } from '../service/categorie.service';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { ServiceeService } from '../service/servicee.service';
import { Servicee } from 'src/models/Servicee';
import { Demande } from 'src/models/Demande';
import { DemandeService } from '../service/demande.service';

@Component({
  selector: 'app-comptepartuculier',
  templateUrl: './comptepartuculier.component.html',
  styleUrls: ['./comptepartuculier.component.css']
})
export class ComptepartuculierComponent  implements OnInit{
  showDemandes = false;
   user: any = null;
    profileImageUrl: SafeUrl | null = null; 
    categories: any[] = [];
    imageUrls: string[] = [];
    currentIndex = 0; 
  itemsPerPage = 8; 
  userId!: number;
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
  services: any[] = [];
  demandes: Demande[] = [];
    constructor(private fileService: FileService, 
      private sanitizer: DomSanitizer, private router:
       Router,private categorieService:CategorieService,
      private service:ServiceeService,
      private demandeService: DemandeService) {}
    ngOnInit(): void {
      this.loadUserData();
      this.getAllCategories();
      this.getDemandesByUserId();
    
    }
    loadUserData(): void {
      const token = localStorage.getItem('accessToken');
    
      if (token) {
        try {
          const decodedToken: any = jwtDecode(token);
          this.user = decodedToken;
          this.userId = decodedToken.id;
    
        
    
          if (this.user.image) {
           
            this.loadProfileImage(this.user.image);
          } else {
            console.warn(" Aucune image trouvée dans le token !");
          }
        } catch (error) {
          console.error(' Erreur lors du décodage du token:', error);
        }
      } else {
        console.warn(" Aucun token trouvé dans localStorage !");
      }
    }
   
   getAllServicesByCategorie(categorieId: number) {
      this.service.getAllServicesByCategorie(categorieId).subscribe(
        (services: Servicee[]) => {
          this.services = services;
          this.services.forEach((service, index) => {
            this.getImage(service.imageService, index);
          });
         
        },
        (error) => {
          console.error('Erreur lors du chargement des services:', error);
          
        }
      );
    }
  
   
    loadProfileImage(filename: string): void {
      this.fileService.getImage(filename).subscribe({
        next: (imageBlob) => {
          const objectURL = URL.createObjectURL(imageBlob);
          this.profileImageUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        },
        error: (err) => {
          console.error(' Erreur de chargement de l\'image', err);
          this.profileImageUrl = null; 
        }
      });
    }
    getAllCategories() {
      this.categorieService.getAllCategories().subscribe(
        (data) => {
          this.categories = data;
         
          this.categories.forEach((category, index) => {
            this.getImage(category.imageCategorie, index);

          });
        },
        (error) => {
          console.error('Erreur lors du chargement des catégories', error);
        }
      );
    }
    
  
    
    getImage(filename: string, index: number) {
      this.fileService.getImage(filename).subscribe(
        (imageBlob) => {
          const imageUrl = URL.createObjectURL(imageBlob);
          this.imageUrls[index] = imageUrl;
         
        },
        (error) => {
          console.error('Erreur lors du chargement de l\'image', error);
        }
      );
    }
  
    get visibleCategories() {
      return this.categories.slice(this.currentIndex, this.currentIndex + this.itemsPerPage);
    }
 
    prevCategory() {
      if (this.currentIndex > 0) {
        this.currentIndex -= this.itemsPerPage;
      }
    }
  
   
    nextCategory() {
      if (this.currentIndex + this.itemsPerPage < this.categories.length) {
        this.currentIndex += this.itemsPerPage;
      }
    }
    getDemandesByUserId() {
      if (this.userId) {
        this.demandeService.getAllDemandesByUtilisateurId(this.userId).subscribe(
          (data: Demande[]) => {
            this.demandes = data;
            console.log('Demandes récupérées :', this.demandes);
          },
          (error) => {
            console.error('Erreur lors de la récupération des demandes', error);
          }
        );
      }
    }
    logout(): void {
  
      localStorage.removeItem('accessToken')
      this.router.navigate(['/Front']); 
    }
    toggleDemandes() {
      this.showDemandes = !this.showDemandes;
    }  
  }
  

