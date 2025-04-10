import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FileService } from '../service/file.service';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { AuthServiceService } from '../service/auth-service.service';

import { CategorieService } from '../service/categorie.service';
import { ServiceeService } from '../service/servicee.service';
import { Servicee } from 'src/models/Servicee';

import { WebsocketServiceService } from '../service/websocket-service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbarcompte',
  templateUrl: './navbarcompte.component.html',
  styleUrls: ['./navbarcompte.component.css']
})
export class NavbarcompteComponent implements OnInit , AfterViewInit {
  
  messages: string[] = [];
    selectedServiceId!: number;  
    displayedCategories: any[] = []; 
    currentIndex: number = 0; 
    demandesDisponibles: any[] = [];
    totalCategories: number = 0; 
    categories: any[] = [];
    imageUrls: string[] = [];
    notificationMessage: string = '';
    services: any[] = []; 
    selectedCategory: any = null;  
    allCategories: any[] = []; 
    Categories: any[] = [];
    filteredCategories: any[] = []; 
    private notificationsSubscription: any;
    
    itemsPerPage = 4; 
    notifications: string[] = [];

   
    newFilteredCategories: any[] = []
    searchQuery: string = '';
    filteredServices: Servicee[] = [];
    searchQueryservice: string = '';
    showModal = false;
    showServiceModal = false; 
    selectedServices: any[] = [];
    notification: string | null = null;
    showNotification: boolean = false;
  isMenuOpen: boolean = true;
     user: any = null;
    profileImageUrl: SafeUrl | null = null; 
    userRole: string | null = null;
   
    private subscription: Subscription = new Subscription();
    constructor(private fileService: FileService, 
      private sanitizer: DomSanitizer, 
     
   
      private authServiceService:AuthServiceService,
    private categorieService:CategorieService,private file:FileService,
        private service:ServiceeService,
        private router: Router,
        private websocketService: WebsocketServiceService,
        private cdr: ChangeDetectorRef
       ) {}
    
    ngAfterViewInit(): void {
    this.toggleMenu();
      
    }



    ngOnInit(): void {
      this.notificationsSubscription = this.websocketService.getNotifications().subscribe((message: string) => {
        this.notificationMessage = message;  // Met à jour le message de notification
      });
      this.websocketService.connect(); // Connexion au service WebSocket
    
    
    
  
   
  

      this.userRole = this.authServiceService.getUserRole();
      this.loadUserData();
      this.getAllCategories();
     
      this.redirectBasedOnRole();
      
     
      this.fileService.profileImage$.subscribe((newImageUrl) => {
        if (newImageUrl) {
          this.profileImageUrl = this.sanitizer.bypassSecurityTrustUrl(newImageUrl);
         
        }
      });
    
    }

    ngOnDestroy(): void {
      // Se désabonner lors de la destruction du composant pour éviter les fuites de mémoire
      if (this.notificationsSubscription) {
        this.notificationsSubscription.unsubscribe();
      }
    }
  
  
    toggleNotification(): void {
      this.showNotification = !this.showNotification;
    }
    redirectBasedOnRole(): void {
      if (this.userRole === 'prestataire') {
        this.router.navigate(['/Compteprestaitre']);
      } else if (this.userRole === 'entreprise') {
        this.router.navigate(['/Compteprestaitre']);
      } else {
        console.error('Rôle inconnu');
      }
    }
    
  getImage(filename: string, index: number) {
    this.file.getImage(filename).subscribe(
      (imageBlob) => {
        const imageUrl = URL.createObjectURL(imageBlob);
        this.imageUrls[index] = imageUrl;
       
      },
      (error) => {
       // console.error('Erreur lors du chargement de l\'image', error);
      }
    );
  }
   
    loadUserData(): void {
      const token = localStorage.getItem('accessToken');
    
      if (token) {
        try {
          const decodedToken: any = jwtDecode(token);
          this.user = decodedToken;
    
        
    
          if (this.user.image) {
           
            this.loadProfileImage(this.user.image);
          } else {
            console.warn(" Aucune image trouvée dans le token !");
          }
        } catch (error) {
          console.error(' Erreur lors du décodage du token:', error);
        }
      } else {
        console.warn("⚠ Aucun token trouvé dans localStorage !");
      }
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
  
    toggleMenu(): void {
      this.isMenuOpen = !this.isMenuOpen; 
    }


    showSkillModal() {
    
      this.getAllCategories();
  
      this.showModal = true;
    }
  
    
    closeServiceModal() {
      this.showServiceModal = false;
      this.showModal = false
    
    }
    
  
    getAllCategories() {
      this.categorieService.getAllCategories().subscribe(
        (data) => {
          this.filteredCategories = data;
          
         
          if (this.filteredCategories.length === 0) {
            console.warn('Aucune catégorie trouvée');
          }
          this.filteredCategories.forEach((category, index) => {
            this.getImage(category.imageCategorie, index); 
          });
        },
        (error) => {
          console.error('Erreur lors du chargement des catégories', error);
        }
      );
    }
    onSearch(): void {
 
  
      if (this.searchQuery.trim() === '') {
        this.getAllCategories();
      } else {
        this.categorieService.searchCategories(this.searchQuery).subscribe(
          (data) => {
           
    
            this.filteredCategories = data; 
         
          },
          (error) => {
            console.error('Erreur lors de la recherche des catégories', error);
          }
        );
      }
    }
    filterServices() {
      if (this.searchQuery.trim() === '') {
       
        this.filteredServices = this.services;
      } else {
     
        this.filteredServices = this.services.filter(service =>
          service.nomservice && service.nomservice.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }
    }
    
    
      selectCategory(categoryName: string) {
        this.selectedCategory = this.filteredCategories.find(category => category.nom === categoryName) || null;
      
        if (this.selectedCategory) {
         
        
          this.getAllServicesByCategorie(this.selectedCategory.id); 
          this.showServiceModal = true;
        } else {
          console.error('Catégorie non trouvée');
        }}
      getAllServicesByCategorie(categorieId: number) {
        this.service.getAllServicesByCategorie(categorieId).subscribe(
          (services: Servicee[]) => {
            this.services = services;
            this.services.forEach((service, index) => {
              this.getImage(service.imageService, index);
            });
            this.filterServices();
          },
          (error) => {
            console.error('Erreur lors du chargement des services:', error);
            
          }
        );
      }

  logout(): void {
  
    localStorage.removeItem('accessToken')
    this.router.navigate(['/Front']); 
  }
  selectService(service: any) {
    this.selectedServiceId = service.idservice;  
  
    const token = localStorage.getItem('accessToken');
    let userEmail = '';
  
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        userEmail = decodedToken.sub;  
      
      } catch (error) {
        console.error("Erreur lors du décodage du token :", error);
      }
    }
  
    if (!this.selectedServiceId) {
      console.error("ID du service est indéfini !");
      return;
    }
  
    this.router.navigate(['/Demandeservice'], { 
      queryParams: { idservice: this.selectedServiceId, email: userEmail } 
    });  
  }
  
  
  
 }
  
  


