import { Component } from '@angular/core';
import { Avis } from 'src/models/Avis';
import { AvisService } from '../../service/avis.service';
import { FileService } from '../../service/file.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-avissection',
  templateUrl: './avissection.component.html',
  styleUrls: ['./avissection.component.css']
})
export class AvissectionComponent {
  topAvisList: Avis[] = [];
  isLoading: boolean = true; 

  constructor(private avisService: AvisService, 
    private fileservice: FileService,
    private router: Router) {}

  ngOnInit(): void {
    this.getTopAvis();
  }

  getTopAvis(): void {
    this.avisService.getTopAvisByUtilisateur().subscribe({
      next: (data) => {
      
        this.topAvisList = data.slice(0, 9); 
        this.isLoading = false; 
        this.topAvisList.forEach(avis => {
          if (avis.avisUtilisateur) {
            this.loadProfileImage(avis.avisUtilisateur);
          }
        });
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des avis :', err);
        this.isLoading = false;  
      }
    });
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
  getStarsArray(note: number): number[] {
    return Array(note).fill(0);
  }
  goToCompte(id: number | undefined) {
    if (id) {
      this.router.navigate(['/Compte', id]);
    }
}
}
