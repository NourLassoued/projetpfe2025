import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { AvisService } from '../service/avis.service';
import { ToastrService } from 'ngx-toastr';
import { Avis } from 'src/models/Avis';

@Component({
  selector: 'app-mesevolutiosprestaitre',
  templateUrl: './mesevolutiosprestaitre.component.html',
  styleUrls: ['./mesevolutiosprestaitre.component.css']
})
export class MesevolutiosprestaitreComponent {
   avisList: Avis[] = []; 
   showDemandes = false;
   scoreMoyen: number = 0;
    userId!: number;
    user: any = null;
    editModeId: number | null = null;
  editCommentaire: string = '';
  editNote: number = 1;
  
          constructor( 
            private router: Router,
            private avisService: AvisService ,
            private toastr: ToastrService, 
            ) {}
  
  
  
            ngOnInit(): void {
             
               this.loadUserData();
               this.loadScoreMoyen();
               this.loadAvis();
              
            
            }
            loadAvis(): void {
              this.avisService.getAvisParprestatitr(this.userId).subscribe(
                (avis: Avis[]) => {
                  this.avisList = avis;
                  console.log('Liste des avis:', this.avisList);
                },
                (error) => {
                  console.error('Erreur lors de la récupération des avis du prestataire:', error);
                }
              );
            }
  
          
  
  
  
              loadUserData(): void {
                 const token = localStorage.getItem('accessToken');
               
                 if (token) {
                   try {
                     const decodedToken: any = jwtDecode(token);
                     this.user = decodedToken;
                     this.userId = decodedToken.id;
                    } catch (error) {
                      console.error(' Erreur lors du décodage du token:', error);
                    }
                  } else {
                    console.warn(" Aucun token trouvé dans localStorage !");
                  }
                }
                       
  
             
  
  
  
  
    logout(): void {
    
      localStorage.removeItem('accessToken')
      this.router.navigate(['/Front']); 
    }
   
    getFullStars(note: number | undefined): string[] {
      return Array(note ?? 0).fill('★');
    }
    
    getEmptyStars(note: number | undefined): string[] {
      const full = note ?? 0;
      return Array(5 - full).fill('☆');
    }

 
  toggleDemandes() {
    this.showDemandes = !this.showDemandes;
  }
  loadScoreMoyen(): void {
    this.avisService.getScoreMoyen(this.userId).subscribe(
      (score: number) => {
        this.scoreMoyen = score; 
      
      },
      (error) => {
        console.error('Erreur lors de la récupération du score moyen:', error);
        this.toastr.error('Impossible de charger le score moyen', 'Erreur');
      }
    );
  }

  }
  


