import { ChangeDetectorRef, Component } from '@angular/core';
import { Servicee } from 'src/models/Servicee';
import { CategorieService } from '../../service/categorie.service';
import { FileService } from '../../service/file.service';
import { ServiceeService } from '../../service/servicee.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-decoration',
  templateUrl: './decoration.component.html',
  styleUrls: ['./decoration.component.css']
})
export class DecorationComponent {
    services: Servicee[] = [];
        imageUrls: string[] = [];
        showModal=false;
        filteredServices: Servicee[] = [];
        searchQuery: string = '';
        categoryName: string = '';
        selectedServiceId!: number;
        constructor(private file:FileService,
            private service:ServiceeService,
           
            private router: Router,
            ) {}
            ngOnInit(): void {
                  
              this.categoryName = JSON.parse(localStorage.getItem('categorieName') || '""');  
              
              if (this.categoryName) {
              
                this.getServicesByCategoryName(this.categoryName); 
              } else {
                console.warn("Aucun nom de catégorie trouvé dans localStorage.");
              }
            
              this.startTypingEffect();  
            }
            ngOnDestroy() {
       
       
              
              localStorage.removeItem('categorieName')
            } 
      
        openServiceModal() {
          this.showModal = true;
        }
      
       
        closeServiceModal() {
          this.showModal = false;
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
              console.error(` Erreur lors du chargement de l'image ${filename}`, error);
            }
          );
        }
      
        searchServices() {
       
          const categorieName = localStorage.getItem('categorieName');
          
          if (categorieName) {
           
            this.getServicesByCategoryName(categorieName);
          } else {
            console.warn("Aucun nom de catégorie valide trouvé dans localStorage.");
          }
        }
        
       
          getServicesByCategoryName(categorieName: string): void {
            this.service.getServicesByCategoryName(categorieName).subscribe(
              (services: Servicee[]) => {
               
                if (services && services.length > 0) {
                  this.services = services;
      
                  this.services.forEach((service, index) => {
                    if (service.imageService) {
                     
                      this.getImage(service.imageService, index);
                    
                    } 
                    
                    else {
                      console.warn(`Pas d'image pour le service ${service.nomservice}, utilisation de l'image par défaut.`);
                      this.imageUrls[index] = 'assets/default-image.jpg';
                    }
                  });
                  this.filterServices();
                
                } else {
                  console.warn('Aucun service trouvé pour la catégorie:', categorieName);
                }
              },
              (error) => {
                console.error('Erreur lors de la récupération des services:', error);
              }
            );
          }
        
            placeholders: string[] = [
              "Aménagement et design d’espace 🛋️",
              "Peinture et revêtements muraux 🎨",
            
             
             "Rénovation et embellissement d’intérieur ✨",
              
             
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
          selectService(service: any) {
            this.selectedServiceId = service.idservice; 
            this.router.navigate(['/Demande'], { queryParams: { idservice: this.selectedServiceId } });  // ✅ Naviguer vers /demande avec l'ID
          }
          }
    
    
    
  
  
  


