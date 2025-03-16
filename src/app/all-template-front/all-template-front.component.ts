import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { CategorieService } from '../service/categorie.service';
import { FileService } from '../service/file.service';
import { ServiceeService } from '../service/servicee.service';
import { Router } from '@angular/router';
import { Servicee } from 'src/models/Servicee';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-all-template-front',
  templateUrl: './all-template-front.component.html',
  styleUrls: ['./all-template-front.component.css']
})
export class AllTemplateFrontComponent {
  imageUrlss: { [key: string]: string } = {
    'Déménagement': 'assets/images/demenagement.jpg',
    'Ménage': 'assets/images/menage.jpg',
    'Enfants': 'assets/images/enfants.jpg',
    'Animaux': 'assets/images/animaux.jpg'
  };
  displayedCategories: any[] = []; // Les catégories actuellement affichées
  currentIndex: number = 0; // L'index actuel
 
  totalCategories: number = 0; // Nombre total de catégories
  categories: any[] = [];
  imageUrls: string[] = [];

  services: any[] = []; 
  selectedCategory: any = null;  
  allCategories: any[] = []; 
  Categories: any[] = [];
  filteredCategories: any[] = []; 
   
  
  itemsPerPage = 4; 
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
 
  newFilteredCategories: any[] = []
  searchQuery: string = '';

  showModal = false;
  showServiceModal = false; 
  selectedServices: any[] = [];
  
  constructor(private http:HttpClient,private categorieService:CategorieService,private file:FileService,
    private service:ServiceeService,
    private router: Router,
    private cdr: ChangeDetectorRef) {
      this.startTypingEffect(); 
    }
    ngOnInit(): void {
   this.getAllCategories();
   this. getAllCategoriess() ;
      
    
    }
    showSkillModal() {
    
      this.getAllCategories();
  
      this.showModal = true;
    }
    /*
  getAllCategories() {
    this.categorieService.getAllCategories().subscribe(
      (data) => {
        this.filteredCategories = data;
       
        this.filteredCategories.forEach((category, index) => {
          this.getImage(category.imageCategorie, index);
        });
      },
      (error) => {
        console.error('Erreur lors du chargement des catégories', error);
      }
    );
  }*/
    getAllCategories() {
      this.categorieService.getAllCategories().subscribe(
        (data) => {
          this.filteredCategories = data;
          
         
          if (this.filteredCategories.length === 0) {
            console.warn('Aucune catégorie trouvée');
          }
          this.filteredCategories.forEach((category, index) => {
            this.getImage(category.imageCategorie, index); // Vérifiez que cette méthode existe et fonctionne
          });
        },
        (error) => {
          console.error('Erreur lors du chargement des catégories', error);
        }
      );
    }

    getAllCategoriess() {
      this.categorieService.getAllCategories().subscribe(
        (data) => {
          this.categories = data.map((category) => ({
            ...category,
            imageCategorie: this.getStaticImage(category.nom ?? '') // Remplace undefined par une chaîne vide
          }));
        },
        (error) => {
          console.error('Erreur lors du chargement des catégories', error);
        }
      );
    }
    getStaticImage(categoryName?: string): string {
      const imageMap: { [key: string]: string } = {
      
        'Ménage': '/assets/img/menage.png',
        'Enfants': '/assets/img/enfants.png',
        'Aide à domicile': '/assets/img/Aide à domicile.png',
        'Animaux': '/assets/img/animaux.png',
        'Cours particuliers': '/assets/img/Cours particuliers.png',
        'Déménagement': '/assets/img/Transpore.png',
        'Sécurité et domotique': '/assets/img/Sécurité et domotique.png',
        'Informatique': '/assets/img/Informatique.png',
        'Bricolage': '/assets/img/Bricolage.png',
        'Jardinage': '/assets/img/Jardinage.png',
        'Décoration et Finitions': '/assets/img/Décoration et Finitions.png',
        'Construction et Gros Œuvre ': '/assets/img/Construction et Gros Œuvre.png',
      };
    
      return imageMap[categoryName || ''] || 'assets/images/default.jpg'; // Image par défaut si nom non trouvé
    }
    updateCategoriesToShow() {
      // Met à jour les catégories à afficher, seulement 4 catégories à la fois
      this.Categories = this.Categories.slice(this.currentIndex, this.currentIndex + this.itemsPerPage);
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
      },
      (error) => {
        console.error('Erreur lors du chargement des services:', error);
        alert('Une erreur est survenue lors du chargement des services.'); 
      }
    );
  }

    placeholders: string[] = [
      "Quel service recherchez-vous?",
      "Votre confort, notre priorité !",
     
      "Trouvez un professionnel près de chez vous !",
      
       "Besoin d’un plombier, électricien ?",
     
    ];
  
    currentPlaceholder: string = "";
    private index: number = 0;
    private charIndex: number = 0;
    private typingSpeed: number = 100;
    private isTyping: boolean = false;
  
    
  
    startTypingEffect() {
      this.typePlaceholder(); 
      setInterval(() => { if (!this.isTyping) {  
        this.typePlaceholder();
      }
    }, 2000);  
  }
  
  typePlaceholder() {
    if (this.isTyping) return; 
  
    this.isTyping = true; 
    this.currentPlaceholder = ""; 
    this.charIndex = 0;
    const text = this.placeholders[this.index];
  
    const typingInterval = setInterval(() => {
      if (this.charIndex < text.length) {
        this.currentPlaceholder += text[this.charIndex];
        this.charIndex++;
      } else {
        clearInterval(typingInterval);
        setTimeout(() => {
          this.isTyping = false;  
          this.index = (this.index + 1) % this.placeholders.length;
        }, 100);  
      }
    }, this.typingSpeed);
  } 
  
  get visibleCategories() {
    return this.categories.slice(this.currentIndex, this.currentIndex + this.itemsPerPage);
  }

  // Passer aux catégories précédentes
  prevCategory() {
    if (this.currentIndex > 0) {
      this.currentIndex -= this.itemsPerPage;
    }
  }

  // Passer aux catégories suivantes
  nextCategory() {
    if (this.currentIndex + this.itemsPerPage < this.categories.length) {
      this.currentIndex += this.itemsPerPage;
    }
  }


}