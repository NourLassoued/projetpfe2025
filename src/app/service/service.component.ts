import { ChangeDetectorRef, Component } from '@angular/core';
import { UtilisateurService } from './utilisateur.service';
import { FileService } from './file.service';
import { Router } from '@angular/router';
import { CategorieService } from './categorie.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceeService } from './servicee.service';
import { SafeUrl } from '@angular/platform-browser';
import { jwtDecode } from 'jwt-decode';
import { Categorie } from 'src/models/Categorie';
import { Servicee } from 'src/models/Servicee';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css']
})
export class ServiceComponent {
  profileImage: string | null = null; 
     servicee: any[] = [];
     imageUrls: string[] = [];
     showModal: boolean = false; 
     allService: any[] = []; 
     registerForm: FormGroup | undefined;
     selectedFile: File | null = null;
     imagePreview: string | ArrayBuffer | null = null;
     notificationMessage: string = '';
      user: any;
      profileImageUrl: SafeUrl | null = null; 
      categories: Categorie[] = [];
      isEditModalOpen: boolean = false; 
      selectedservice: Servicee = new Servicee(); 
      currentPage: number = 1;
      pageSize: number = 20; 
      totalPages: number = 1;
      pages: number[] = [];
  
      filteredservice: any[] = []; 
    
     
      searchQuery: string = '';
     
    ngOnInit(): void {
          this.registerForm = this.fb.group({
            nomservice: ['', Validators.required],
            description: ['', Validators.required],
            tarif: ['', [ Validators.min(1)]],
            imageService: ['', [ Validators.min(1)]],
            categorie: ['', Validators.required], 
          
          });
              
        
    
        
       
        
          
   
        
     this.getAllService();
    
     

     this.loadUserData();
     this.getAllCategories();
     this.updatePagess();
     this.paginates();
  
     
    
    
   
          
        }
        
         
     
    
  
      
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
      private fb: FormBuilder,
    private service:ServiceeService) {
        

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
        onFileSelected(event: Event): void {
          const input = event.target as HTMLInputElement;
          if (input.files && input.files[0]) {
            this.selectedFile = input.files[0];
          }
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
       
        getAllService(): void {
          this.service.getAllServices().subscribe(
              (data) => {
                  this.allService = data;
                  this.filteredservice = data;
      
                
                  this.totalPages = Math.ceil(this.filteredservice.length / this.pageSize);
                  this.currentPage = 1; 
                 
                  this.updatePagess(); 
                  this.paginates();
      
                 
              },
              (error) => {
                  console.error('Erreur lors du chargement des services', error);
              }
          );
      }
      
          
          paginates(): void {
            if (this.filteredservice.length === 0) return;

          
            if (this.currentPage < 1) this.currentPage = 1;
            if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
          
            const start = (this.currentPage - 1) * this.pageSize;
            const end = start + this.pageSize;
            this.servicee = this.filteredservice.slice(start, end)
          
          
            this.servicee.forEach((service, index) => {
              this.getImage(service.imageService, index);
              
            });
           

          
            this.updatePagess(); 

          
          }
           
            
          
          updatePagess(): void {
            this.pages = [];
          
            for (let i = 1; i <= this.totalPages; i++) {
              this.pages.push(i);
            }
          }
          
          
          changePages(page: number): void {
            if (page >= 1 && page <= this.totalPages) {
              this.currentPage = page;
              this.paginates(); 
            }
          }
          
        
      
        getAllCategories(): void {
          this.categorieService.getAllCategories().subscribe(
            (categories: Categorie[]) => {
              
              this.categories = categories; 
            },
            (error) => {
              console.error('Erreur lors de la récupération des catégories:', error);
            }
          );
        }
      
          onSubmit(): void {
            if (!this.registerForm || this.registerForm.invalid) {
              console.error('Formulaire invalide.');
              return; 
            }
          
           
            const formData = new FormData();
          
          
            formData.append('nomservice', this.registerForm.get('nomservice')?.value || ''); // Utilise une chaîne vide si la valeur est undefined
            formData.append('description', this.registerForm.get('description')?.value || '');
          
            formData.append('tarif', this.registerForm.get('tarif')?.value || '0');
           
            if (this.selectedFile) {
              formData.append('imageService', this.selectedFile);
            }
          
            if (this.selectedFile) {
              formData.append('imageService', this.selectedFile);
            }
        
            const categorieId = this.registerForm.get('categorie')?.value; 
        
            if (categorieId) {
            
              this.service.addServiceToCategory(categorieId, formData).subscribe(
                (response) => {
                  this.notificationMessage = 'Service ajouté avec succès!';
                  setTimeout(() => {
                    this.notificationMessage = ''; 
                  }, 1000); 
                  this.getAllService();
                  this.registerForm!.reset();

                },
                (error) => {
                  this.notificationMessage = 'Erreur lors de l\'ajout du service.';
                  console.error('Erreur:', error);
                }
              );
            } else {
              this.notificationMessage = 'La catégorie doit être sélectionnée.';
            }
          }
          onSearch(): void {
            
          
            if (this.searchQuery.trim() === '') {
            
              this.filteredservice = this.allService;
            } else {
              this.service.rechercherService(this.searchQuery).subscribe(
                (data) => {
                 
          
                  this.filteredservice = data; 
                  this.totalPages = Math.ceil(this.filteredservice.length / this.pageSize);
                  this.currentPage = 1; 
                  this.updatePagess();
                  this.paginates();
               
                },
                (error) => {
                  console.error('Erreur lors de la recherche des catégories', error);
                }
              );
            }
          }
          deleteservice(idservice: number): void {
          
            if (idservice) {
              this.service.deleteService(idservice).subscribe({
                next: () => {
                  this.servicee = this.servicee.filter(service => service.idservice !== idservice);
                  this.getAllService();
                },
                error: err => {
                  console.error('Erreur lors de la suppression:', err);
                  alert('Une erreur est survenue lors de la suppression.');
                }
              });
            } else {
              console.error('ID du service manquant');
            }
          }
          updateCategory(): void {
            if (!this.selectedservice || this.selectedservice.idservice === undefined) {
                console.error("ID du service manquant !");
                return;
            }
        
            const formData = new FormData();
        
            formData.append('nomservice', this.selectedservice.nomservice || '');
            formData.append('description', this.selectedservice.description || '');
            if (this.selectedservice.tarif !== undefined && this.selectedservice.tarif !== null) {
              formData.append('tarif', this.selectedservice.tarif.toString());
            } else {
              formData.append('tarif', '0'); 
            }
        
            if (this.selectedFile) {
                formData.append('imageService', this.selectedFile);
            }
        
            this.service.updateService(this.selectedservice.idservice, formData).subscribe(
                response => {
                   
        
                   
                    if (this.selectedFile && response.imageService) {
                        const index = this.servicee.findIndex(s => s.idservice === response.idservice);
                        if (index !== -1) {
                            this.getImage(response.imageService, index);
                        }
                    }
        
                    this.closeEditModal();
                    this.getAllService();
                    this.cdr.detectChanges(); 
                },
                error => {
                    console.error('Erreur lors de la mise à jour du service:', error);
                }
            );
        }
        
             
      openEditModal(service: Servicee): void {
        this.selectedservice = { ...service }; 
        this.isEditModalOpen = true;
      }
      
      
      closeEditModal(): void {
        this.isEditModalOpen = false;
        }         
       }