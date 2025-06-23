import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { DemandeService } from '../service/demande.service';
import { Postulation } from 'src/models/Postulation';
import { ToastrService } from 'ngx-toastr';

import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-postulation',
  templateUrl: './postulation.component.html',
  styleUrls: ['./postulation.component.css']
})
export class PostulationComponent {
  userId!: number;
  user: any = null;
  isUpdateModalOpen = false;
updatedPostulation: any = {};

 
  isDeleting: boolean = false;

  postulations: Postulation[] = [];
  postulationForm!: FormGroup; // Formulaire pour la mise à jour
  postulation: any; // Données de la postulation
  errorMessage: string = '';
  postulationIdToUpdate: number = 0;

 constructor(
    private  readonly router:
       Router, private readonly demandeservice:DemandeService,
        private  readonly toastr: ToastrService,
       
        private  readonly fb: FormBuilder) {}

       ngOnInit(): void {
        this.postulationForm = this.fb.group({
          commentaire: ['', Validators.required],
        
        });
        this.loadUserData();
      this.loadPostulations(this.userId); }

      openUpdateModal(postulation: Postulation): void {
        if (postulation.id === undefined) {
          console.error('L\'ID de la postulation est invalide');
          return;
        }
        this.updatedPostulation = { ...postulation };  // Clone the postulation for editing
        this.isUpdateModalOpen = true;  // Open the modal
        this.postulationIdToUpdate = postulation.id;  // Store the ID for update
      }
      closeUpdateModal(): void {
        this.isUpdateModalOpen = false;  // Fermer le modal
      }
      
    

       loadUserData(): void {
          const token = localStorage.getItem('accessToken');
        
          if (token) {
            try {
              const decodedToken: any = jwtDecode(token);
              this.user = decodedToken;
              this.userId = decodedToken.id;
            
        
             
              
              if (this.userId) {
                this.loadPostulations(this.userId);
              } else {
                console.error("Erreur : ID utilisateur non défini !");
              }
            } catch (error) {
              console.error('Erreur lors du décodage du token:', error);
            }
          } else {
            console.warn("Aucun token trouvé dans localStorage !");
          }
        }
        loadPostulations(id: number): void {
          this.demandeservice.getPostulationsByPrestataire(id).subscribe({
            next: (data) => {
              this.postulations = data;
              
            },
            error: (err) => {
              console.error("Erreur lors du chargement des postulations", err);
            }
          });
        }
        deletePostulation(id: number | undefined): void {
          if (id === undefined) {
            console.error('L\'ID de la postulation est invalide');
            return;
          }
          Swal.fire({
            title: 'Supprimer la postulation ?',
            text: " Êtes-vous sûr de vouloir supprimer cette postulation ?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oui, supprimer',
            cancelButtonText: 'Annuler'
          }).then((result) => {
            if (result.isConfirmed) {
              this.isDeleting = true;
              this.demandeservice.deletePostulation(id).subscribe({
                next: () => {
                  this.isDeleting = false;
                  this.toastr.success('La postulation a été supprimée avec succès !', 'Succès', {
                    timeOut: 3000,
                    progressBar: true,
                    closeButton: true
                  });
                  this.loadPostulations(this.userId);
                },
                error: (error) => {
                  this.isDeleting = false;
                  this.toastr.error('Une erreur est survenue lors de la suppression.', 'Erreur', {
                    timeOut: 3000,
                    progressBar: true,
                    closeButton: true
                  });
                }
              });
            }
          });
        }
     
        submitUpdatePostulation(): void {
          const updatedData = {
            commentaire: this.updatedPostulation.commentaire
          };
        
          this.demandeservice.updatePostulation(this.updatedPostulation.id, updatedData).subscribe({
            next: () => {
              this.isUpdateModalOpen = false;
              this.loadPostulations(this.userId);  
              this.toastr.success('Postulation mise à jour avec succès!', 'Succès');
            },
            error: (error) => {
              console.error('Erreur lors de la mise à jour de la postulation', error);
              this.toastr.error('Une erreur est survenue lors de la mise à jour de la postulation', 'Erreur');
            }
          });
        }
        
        
      

  logout(): void {
  
    localStorage.removeItem('accessToken')
    this.router.navigate(['/Front']); 
  }
handleDeleteKey(event: KeyboardEvent, id: number): void {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    this.deletePostulation(id);
  }
}
handleCloseKey(event: KeyboardEvent): void {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    this.closeUpdateModal();
  }
}


}

