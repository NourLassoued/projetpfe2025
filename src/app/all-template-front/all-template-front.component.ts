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
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
 
  newFilteredCategories: any[] = []
  searchQuery: string = '';
  filteredServices: Servicee[] = [];
  searchQueryservice: string = '';
  showModal = false;
  showServiceModal = false; 
  selectedServices: any[] = [];
  
  constructor(private categorieService:CategorieService,private file:FileService,
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

    getAllCategoriess() {
      this.categorieService.getAllCategories().subscribe(
        (data) => {
          this.categories = data.map((category) => ({
            ...category,
            imageCategorie: this.getStaticImage(category.nom ?? '') 
          }));
        },
        (error) => {
          console.error('Erreur lors du chargement des catégories', error);
        }
      );
    }
    getStaticImage(categoryName?: string): string {
      if (!categoryName) return '/assets/img/default.png'; 

  const normalizedCategory = categoryName.trim(); 

      const imageMap: { [key: string]: string } = {
        'Bricolage': '/assets/img/Bricolage.png',
      
        'Ménage': '/assets/img/menage.png',
        'Jardinage': '/assets/img/Jardinage.png',
        'Enfants': '/assets/img/enfants.png',
        'Déménagement':'/assets/img/demenagement.png',
        'Aide à domicile': '/assets/img/Aide à domicile.png',
        'Animaux': '/assets/img/animaux.png',
       
        'Informatique': '/assets/img/Informatique.png',
        'Cours particuliers': '/assets/img/Cours particuliers.png',
       
        'Construction et Gros oeuvre': '/assets/img/Construction et Gros oeuvre.png',
       
      
        'Décoration et Finitions': '/assets/img/Décoration et Finitions.png',
        'Sécurité et domotique': '/assets/img/Sécurité et domotique.png',
     
      };
    
    
      return imageMap[normalizedCategory] || '/assets/img/default.png';
    
    }
    updateCategoriesToShow() {
      
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
  filterServices() {
    if (this.searchQuery.trim() === '') {
     
      this.filteredServices = this.services;
    } else {
   
      this.filteredServices = this.services.filter(service =>
        service.nomservice && service.nomservice.toLowerCase().includes(this.searchQuery.toLowerCase())
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
        this.filterServices();
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
navigateToCategory(categorieName: string) {
  const selectedCategory = this.categories.find(category => category.nom === categorieName);  // Chercher par nom
  if (!selectedCategory) {
    console.error('Catégorie non trouvée pour le nom:', categorieName);
    return;  
  }


  localStorage.setItem('categorieName', JSON.stringify(selectedCategory.nom));

  
  const categoryRoutes: { [key: string]: string } = {
    'Bricolage': '/Bricolage',
    'Ménage': '/Ménage',
    'Jardinage':'/Jardinage',
   
    'Enfants': '/Enfants',
    'Déménagement':'/Demenagement',
  };


  const route = categoryRoutes[selectedCategory.nom];

  if (route) { 
    this.router.navigateByUrl(route);  
  } else {
    console.error('Route non définie pour cette catégorie:', selectedCategory.nom);
  }
}

}