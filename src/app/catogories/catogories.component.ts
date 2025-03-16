import { ChangeDetectorRef, Component } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { UtilisateurService } from '../service/utilisateur.service';
import { FileService } from '../service/file.service';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { CategorieService } from '../service/categorie.service';
import { Categorie } from 'src/models/Categorie';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-catogories',
  templateUrl: './catogories.component.html',
  styleUrls: ['./catogories.component.css']
})
export class CatogoriesComponent {
   profileImage: string | null = null; 
   categories: any[] = [];
   imageUrls: string[] = [];
   showModal: boolean = false; 
   newCategorie: Categorie = new Categorie()
   registerForm: FormGroup | undefined;
   selectedFile: File | null = null;
   imagePreview: string | ArrayBuffer | null = null;
   notificationMessage: string = '';
    user: any;
    profileImageUrl: SafeUrl | null = null; 
    selectedCategory: Categorie = new Categorie(); 
    isEditModalOpen: boolean = false; 
    isCategoryModalOpen = false; 
    currentPage: number = 1;
    pageSize: number = 8; 
    totalPages: number = 1;
    pages: number[] = [];

    allCategories: any[] = []; 

    filteredCategories: any[] = []; 
  
   
    searchQuery: string = '';
   

   
  

    
editModal: any;
openModal() {
  
  this.showModal = true;
}

    closeModal() {
      this.showModal = false;
    }
    
  
      constructor(private utilisateurService: UtilisateurService,
        private fileservice:FileService,
          private cdr: ChangeDetectorRef,
      private router:Router,
    private categorieService:CategorieService,
    private fb: FormBuilder) {
      
    
    }
    
      ngOnInit(): void {
        this.registerForm = this.fb.group({
          nom: ['', Validators.required],
          description: ['', Validators.required],
          tarif: ['', [ Validators.min(1)]],
          imageCategorie: ['']
        });
      
      
        
        this.loadUserData();
        this.getAllCategories();
        this.updatePages();
        this.paginate();
        
      }
      
       
      openEditModal(category: Categorie): void {
        this.selectedCategory = { ...category }; 
        this.isEditModalOpen = true;
      }
      
      
      closeEditModal(): void {
        this.isEditModalOpen = false;
      }
      updateCategory(): void {
        if (!this.selectedCategory || this.selectedCategory.id === undefined) {
          console.error("ID de la catégorie manquant !");
          return;
        }
      
        const formData = new FormData();
      
       
        if (this.selectedCategory.nom) {
          formData.append('nom', this.selectedCategory.nom);
        } else {
          formData.append('nom', ''); 
        }
      
        if (this.selectedCategory.description) {
          formData.append('description', this.selectedCategory.description);
        } else {
          formData.append('description', '');
        }
      
        if (this.selectedCategory.tarif !== undefined && this.selectedCategory.tarif !== null) {
          formData.append('tarif', this.selectedCategory.tarif.toString());
        } else {
          formData.append('tarif', '0'); 
        }
      
        if (this.selectedFile) {
          formData.append('imageCategorie', this.selectedFile);
        }
      
        this.categorieService.updateCategorie(this.selectedCategory.id, formData).subscribe(
          response => {
            console.log('Catégorie mise à jour avec succès:', response);
            this.closeEditModal();
            this.getAllCategories(); 
          },
          error => {
            console.error('Erreur lors de la mise à jour de la catégorie:', error);
          }
        );
      }
      
      loadProfileImagee(imagePath: string): void {
        if (!imagePath) {
          this.profileImageUrl = 'assets/images/user.png'; 
          return;
        }
      
        this.fileservice.getImage(imagePath).subscribe({
          next: (imageBlob) => {
            const objectURL = URL.createObjectURL(imageBlob);
            this.profileImageUrl = objectURL; 
            this.cdr.detectChanges(); 
          },
          error: (err) => {
            console.error("Erreur lors du chargement de l'image :", err);
            this.profileImageUrl = 'assets/images/user.png'; 
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
              this.loadProfileImagee(this.user.image);
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
        logout(): void {
            
          localStorage.removeItem('accessToken')
          this.router.navigate(['/Front']); 
        }

        onSearch(): void {
          console.log("Recherche pour : ", this.searchQuery);
        
          if (this.searchQuery.trim() === '') {
          
            this.filteredCategories = this.allCategories;
          } else {
            this.categorieService.searchCategories(this.searchQuery).subscribe(
              (data) => {
               
        
                this.filteredCategories = data; 
                this.totalPages = Math.ceil(this.filteredCategories.length / this.pageSize);
                this.currentPage = 1; 
                this.updatePages();
                this.paginate();
              },
              (error) => {
                console.error('Erreur lors de la recherche des catégories', error);
              }
            );
          }
        }
        
        getAllCategories(): void {
          this.categorieService.getAllCategories().subscribe(
            (data) => {
              this.allCategories = data;
              this.filteredCategories = data;
              this.totalPages = Math.ceil(this.filteredCategories.length / this.pageSize);
              this.currentPage = 1;
              this.updatePages();
              this.paginate();
            },
            (error) => {
              console.error('Erreur lors du chargement des catégories', error);
            }
          );
        }
        paginate(): void {
          const start = (this.currentPage - 1) * this.pageSize;
          const end = start + this.pageSize;
        
          
          this.categories = this.filteredCategories.slice(start, end);
        
          this.categories.forEach((category, index) => {
            this.getImage(category.imageCategorie, index);
          });
        
          this.updatePages();
        }
        
        updatePages(): void {
          this.pages = [];
          for (let i = 1; i <= this.totalPages; i++) {
            this.pages.push(i);
          }
        }
        
        changePage(page: number): void {
          if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
            this.paginate();
          }
        }
      
  getImage(filename: string, index: number) {
    this.fileservice.getImage(filename).subscribe(
      (imageBlob) => {
        const imageUrl = URL.createObjectURL(imageBlob);
        this.imageUrls[index] = imageUrl;
        
      },
      (error) => {
        console.error('Erreur lors du chargement de l\'image', error);
      }
    );
  }
  onSubmit(): void {
    if (!this.registerForm || this.registerForm.invalid) { 
      console.error('Formulaire invalide.');
      return;
    }

    const formData = new FormData();
    formData.append('nom', this.registerForm.get('nom')?.value || '');
    formData.append('description', this.registerForm.get('description')?.value || '');
    formData.append('tarif', this.registerForm.get('tarif')?.value || '0');

    if (this.selectedFile) {
      formData.append('imageCategorie', this.selectedFile);
    }

    this.categorieService.createCategorie(formData).subscribe(
      response => {
       
        this.router.navigate(['/categories']);
        this.getAllCategories();
      },
      error => {
        console.error('Erreur lors de l\'ajout de la catégorie:', error);
      }
    );
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
    }
  }
  deleteCategory(id: number): void {
   
      this.categorieService.deleteCategorie(id).subscribe({
        next: () => {
        
          this.categories = this.categories.filter(category => category.id !== id);
         this.getAllCategories();
        },
        error: err => {
          console.error('Erreur lors de la suppression:', err);
          alert('Une erreur est survenue lors de la suppression.');
        }
      });
    }
  }
  
 