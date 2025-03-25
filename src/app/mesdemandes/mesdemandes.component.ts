import { Component } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { Demande } from 'src/models/Demande';
import { FileService } from '../service/file.service';
import { CategorieService } from '../service/categorie.service';
import { ServiceeService } from '../service/servicee.service';
import { DemandeService } from '../service/demande.service';
import { jwtDecode } from 'jwt-decode';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-mesdemandes',
  templateUrl: './mesdemandes.component.html',
  styleUrls: ['./mesdemandes.component.css']
})
export class MesdemandesComponent {
   user: any = null;

      categories: any[] = [];
      imageUrls: { [key: number]: string } = {};
   
    userId!: number;
   
    services: any[] = [];
    demandes: Demande[] = [];
      constructor(private fileService: FileService, 
        private router: Router,
        private demandeService: DemandeService) {}
      ngOnInit(): void {
        this.loadUserData();
     
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
    
    
     
     
      
      getImage(filename: string, index: number) {
        const encodedFilename = encodeURIComponent(filename);
        this.fileService.getImage(encodedFilename).subscribe(
          (imageBlob) => {
            const imageUrl = URL.createObjectURL(imageBlob);
            this.imageUrls[index] = imageUrl; 
          },
          (error) => {
            console.error('Erreur lors du chargement de l\'image', error);
            
          }
        );
      }
      
      getDemandesByUserId() {
        if (this.userId) {
          this.demandeService.getAllDemandesByUtilisateurId(this.userId).subscribe(
            (data: Demande[]) => {
              this.demandes = data;
              
              this.demandes.forEach((demande, index) => {
                
                if (demande.demandephoto) {
                  this.getImage(demande.demandephoto, index); 
                }
              });
            },
            (error) => {
              console.error('Erreur lors de la récupération des demandes', error);
            }
          );
        }
      }
      gererDemande(demande: any) {
      
        if (!demande || !demande.idDemande) {
            console.error("Erreur : L'ID de la demande est invalide.");
            return;
        }
        this.router.navigate(['/gerer-demande'], { queryParams: { id: demande.idDemande } });
    }
    
   
    }           