import { Component } from '@angular/core';
import { UtilisateurService } from '../service/utilisateur.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FileService } from '../service/file.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sectionentrprise',
  templateUrl: './sectionentrprise.component.html',
  styleUrls: ['./sectionentrprise.component.css']
})
export class SectionentrpriseComponent {
  entreprises: any[] = [];
  imageUrl: SafeUrl | null = null;
  visibleEntreprises: any[] = [];
  currentIndex: number = 0;
  itemsPerPage: number = 3;  
  constructor(private entrepriseService: UtilisateurService, 
    private fileService: FileService,
    private router: Router,
    private sanitizer: DomSanitizer) {}
    ngOnInit(): void {
      this.entrepriseService.getAllEntreprises().subscribe(entreprises => {
        const entrepriseWithImages: any[] = [];
    
        entreprises.forEach(entreprise => {
          if (entreprise.image) {
            this.fileService.getImage(entreprise.image).subscribe(blob => {
              const objectURL = URL.createObjectURL(blob);
              const safeUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
    
            
              entreprise['safeImageUrl'] = safeUrl;
              entrepriseWithImages.push(entreprise);
    
             
              if (entrepriseWithImages.length === entreprises.length) {
                this.entreprises = entrepriseWithImages;
                this.updateVisibleEntreprises(); 
              }
            });
          } else {
            entrepriseWithImages.push(entreprise);
            if (entrepriseWithImages.length === entreprises.length) {
              this.entreprises = entrepriseWithImages;
              this.updateVisibleEntreprises();
            }
          }
        });
      });
    }
    
    updateVisibleEntreprises(): void {
      this.visibleEntreprises = this.entreprises.slice(this.currentIndex, this.currentIndex + this.itemsPerPage);
    }
  
    nextEntreprise(): void {
      if (this.currentIndex + this.itemsPerPage < this.entreprises.length) {
        this.currentIndex += this.itemsPerPage;
        this.updateVisibleEntreprises();
      }
    }
  
    prevEntreprise(): void {
      if (this.currentIndex > 0) {
        this.currentIndex -= this.itemsPerPage;
        this.updateVisibleEntreprises();
      }
    }
  
   
    navigateToEntreprise(id: number | undefined): void {


      if (id) {
        this.router.navigate(['/Contactentreprise', id]);
      }
    
  }}