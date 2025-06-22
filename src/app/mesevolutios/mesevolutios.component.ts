import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { AvisService } from '../service/avis.service';
import { Avis } from 'src/models/Avis';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-mesevolutios',
  templateUrl: './mesevolutios.component.html',
  styleUrls: ['./mesevolutios.component.css']
})
export class MesevolutiosComponent {
  showDemandes = false;
  avisList: Avis[] = []; 
  userId!: number;
  user: any = null;
  editModeId: number | null = null;
editCommentaire: string = '';
editNote: number = 1;

        constructor( 
          private  readonly router: Router,
          private  readonly avisService: AvisService ,
          private readonly toastr: ToastrService, 
          ) {}



          ngOnInit(): void {
           
             this.loadUserData();
             this.loadAvis();
           
            
          
          }

          loadAvis(): void {
           
            if (this.userId) {
              this.avisService.getAvisParUtilisateur(this.userId).subscribe({
                next: (avis: Avis[]) => {
                  this.avisList = avis; 
                },
                error: (error) => {
                  console.error('Erreur lors de la récupération des avis:', error);
                }
              });
            }
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
                     

              deleteAvis(idAvis: number): void {
                
                  this.avisService.deleteAvis(idAvis).subscribe({
                    next: () => {
                      this.avisList = this.avisList.filter(avis => avis.idAvis !== idAvis);
                      this.toastr.success('Avis supprimé avec succès!', 'Succès');
                      this.loadAvis(); 
                    },
                    error: (error) => {
                      console.error('Erreur lors de la suppression de l\'avis', error);
                      this.toastr.error('Erreur lors de la suppression de l\'avis', 'Erreur');
                    }
                  });
                }
                getFullStars(note: number | undefined): string[] {
                  return Array(note ?? 0).fill('★');
                }
                
                getEmptyStars(note: number | undefined): string[] {
                  const full = note ?? 0;
                  return Array(5 - full).fill('☆');
                }
                startEdit(avis: Avis): void {
                  this.editModeId = avis.idAvis!;
                  this.editCommentaire = avis.commentaire ?? '';
                  this.editNote = avis.note ?? 1;
                }
                
                
                updateAvis(): void {
                  if (this.editModeId !== null) {
                    const updatedAvis = {
                      commentaire: this.editCommentaire,
                      note: this.editNote,
                    };
                
                    this.avisService.updateAvis(this.editModeId, updatedAvis).subscribe({
                      next: () => {
                        this.toastr.success('Avis mis à jour avec succès', 'Succès');
                        this.editModeId = null;
                        this.loadAvis();
                      },
                      error: error => {
                        console.error('Erreur lors de la mise à jour', error);
                        this.toastr.error('Erreur lors de la mise à jour', 'Erreur');
                      }
                    });
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
