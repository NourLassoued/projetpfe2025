import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FileService } from '../service/file.service';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { AuthServiceService } from '../service/auth-service.service';
import { I } from '@fullcalendar/core/internal-common';
import { CategorieService } from '../service/categorie.service';
import { ServiceeService } from '../service/servicee.service';
import { Servicee } from 'src/models/Servicee';

@Component({
  selector: 'app-navbarcompte',
  templateUrl: './navbarcompte.component.html',
  styleUrls: ['./navbarcompte.component.css']
})
export class NavbarcompteComponent implements    AfterViewInit {
    selectedServiceId!: number;  
    displayedCategories: any[] = []; 
    currentIndex: number = 0; 
   
    totalCategories: number = 0; 
    categories: any[] = [];
    imageUrls: string[] = [];
  
    services: any[] = []; 
    selectedCategory: any = null;  
    allCategories: any[] = []; 
    Categories: any[] = [];
    filteredCategories: any[] = []; 
     
    
    itemsPerPage = 4; 
  
   
    newFilteredCategories: any[] = []
    searchQuery: string = '';
    filteredServices: Servicee[] = [];
    searchQueryservice: string = '';
    showModal = false;
    showServiceModal = false; 
    selectedServices: any[] = [];
    
  isMenuOpen: boolean = true;
     user: any = null;
    profileImageUrl: SafeUrl | null = null; 
    userRole: string | null = null;
    
    constructor(private fileService: FileService, 
      private sanitizer: DomSanitizer, 
     
      private authServiceService:AuthServiceService,
    private categorieService:CategorieService,private file:FileService,
        private service:ServiceeService,
        private router: Router,
        private changeDetectorRef: ChangeDetectorRef) {}
    
    ngAfterViewInit(): void {
    this.toggleMenu();
      
    }


    ngOnInit(): void {
      this.userRole = this.authServiceService.getUserRole();
      this.loadUserData();
      this.getAllCategories();
   
    
      this.fileService.profileImage$.subscribe((newImageUrl) => {
        if (newImageUrl) {
          this.profileImageUrl = this.sanitizer.bypassSecurityTrustUrl(newImageUrl);
         
        }
      });
    
    }
   
    
    
  getImage(filename: string, index: number) {
    this.file.getImage(filename).subscribe(
      (imageBlob) => {
        const imageUrl = URL.createObjectURL(imageBlob);
        this.imageUrls[index] = imageUrl;
       
      },
      (error) => {
        console.error('Erreur lors du chargement de l\'image', error);
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
  
  


