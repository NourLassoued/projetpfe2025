import { ChangeDetectorRef, Component, DoCheck, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Utilisateur } from 'src/models/Utilisateur';
import { UtilisateurService } from '../service/utilisateur.service';
import { DisponibiliteDialogComponent } from '../disponibilite-dialog/disponibilite-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { FileService } from '../service/file.service';
import { SafeUrl } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit ,DoCheck {
  prestataires: Utilisateur[] = [];
  @ViewChild('calendarIcon') calendarIcon!: ElementRef;  
 
  selectedPrestataire: Utilisateur | null = null;
  utilisateursParticuliers: Utilisateur[] = [];
  profileImage: string | null = null;
  image: SafeUrl | null = null; 
  sanitizer: any;
  profileImageUrl: SafeUrl | null = null;
  editColumn: string | null = null;
  editRowId: number | null = null;
  newValue: any = '';

  constructor(private utilisateurService: UtilisateurService, public dialog: MatDialog,private fileservice:FileService,  private snackBar: MatSnackBar, private cdr: ChangeDetectorRef) {}
  ngDoCheck() {
    // Cette méthode est appelée à chaque cycle de détection des changements
    console.log('ngDoCheck appelé');
  }
  ngOnInit(): void {
    this.getAllPrestataires(); 
    this.getAllParticuliers();
  }

  getAllPrestataires(): void {
    this.utilisateurService.getPrestataires().subscribe(
      (data) => {
        this.prestataires = data.map(prestataire => ({
          ...prestataire,
          disponibilites: prestataire.disponibilite || [],
          showFullDescription: false,
          servicesOfferts: prestataire.servicesOfferts
            ? prestataire.servicesOfferts.map(service => ({
                ...service,
                nomservice: service.nomservice ? service.nomservice.replace(/[\r\n]+/g, '').trim() : ''
              }))
            : [],
            profileImageUrl: null,
            adresse: prestataire.adressee ? prestataire.adressee.governoate : '',
            doucument_CIN: prestataire.doucument_CIN,
            doucument_cv: prestataire.doucument_cv 
          }));
    
       
          this.prestataires.forEach(prestataire => {
            console.log('Adresse du prestataire :', prestataire.adressee); 
            if (prestataire.image) { 
              this.loadProfileImage(prestataire); 
            }
          });
        },
        (error) => {
          console.error('Erreur lors du chargement des prestataires', error);
        }
      );
    }
  
  getShortDescription(description?: string): string {
    return description ? description.substring(0, 100) + '...' : '';  
  }
  toggleDescription(prestataire: Utilisateur): void {
    prestataire.showFullDescription = !prestataire.showFullDescription;
  } 
  loadProfileImage(prestataire: any): void {
    if (prestataire.image) {
      this.fileservice.getImage(prestataire.image).subscribe({
        next: (imageBlob) => {
          const objectURL = URL.createObjectURL(imageBlob);
          prestataire.image = objectURL; 
        },
        error: () => {
          prestataire.image = 'assets/images/user.png'; 
        }
      });
    }
  }

    showDisponibilites(prestataire: Utilisateur) {
      this.selectedPrestataire = prestataire;
    }
    
    closeDisponibilites() {
      this.selectedPrestataire = null; // Réinitialisation après fermeture
    }
    downloadFile(filename: string): void {
      this.fileservice.getImage(filename).subscribe({
        next: (imageBlob) => {
          
          const objectURL = URL.createObjectURL(imageBlob);
          const link = document.createElement('a');
          link.href = objectURL;
          link.download = filename;  // Nom du fichier téléchargé sera celui de 'filename'
          link.click();  // Simule le clic sur le lien pour lancer le téléchargement
        },
        error: (err) => {
          console.error('Erreur lors du téléchargement du fichier', err);
          alert('Erreur lors du téléchargement du fichier : ' + err.message); 
        }
      });
    }
    getAllParticuliers(): void {
      this.utilisateurService.getUtilisateursParticuliers().subscribe(
        (data) => {
          this.utilisateursParticuliers = data.map(particulier => ({
            ...particulier,
            profileImageUrl: null
          }));
    
         
          this.utilisateursParticuliers.forEach(particulier => {
            this.loadProfileImage(particulier);
          });
        },
        (error) => {
          console.error('Erreur lors du chargement des particuliers', error);
        }
      );
    }
    supprimerUtilisateur(id: number): void {
      this.utilisateurService.deleteUser(id).subscribe(
        () => {
         
          this.prestataires = this.prestataires.filter(prestataire => prestataire.idUtilisateur !== id);
  
        
          this.getAllParticuliers();
          this.cdr.detectChanges();
          console.log('Utilisateur supprimé avec succès');
        },
        (error) => {
          console.error("Erreur lors de la suppression de l'utilisateur", error);
        }
      );
    }
    startEditing(id: number, column: string, currentValue: any): void {
      this.editRowId = id;
      this.editColumn = column;
      this.newValue = currentValue;
    }
    updateUserInTable(id: number, column: string, newValue: any): void {
      this.utilisateurService.updateUser(id, { [column]: newValue }).subscribe(
        (response) => {
          console.log('Utilisateur mis à jour avec succès', response);
          // Mettre à jour la ligne dans le tableau localement
          const utilisateur = this.prestataires.find(p => p.idUtilisateur === id);
          if (utilisateur) {
            utilisateur[column] = newValue; // Mettre à jour la cellule spécifique dans la ligne
          }
          this.editColumn = null; // Quitter le mode édition
          this.editRowId = null;  // Réinitialiser l'ID de la ligne en édition
        },
        (error) => {
          console.error('Erreur lors de la mise à jour de l\'utilisateur', error);
        }
      );
    }
  }