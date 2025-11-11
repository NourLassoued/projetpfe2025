import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FileService } from '../service/file.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-profileparticulier',
  templateUrl: './profileparticulier.component.html',
  styleUrls: ['./profileparticulier.component.css']
})
export class ProfileparticulierComponent implements  OnInit{
 profileImage: string | null = null; 
 user: any;
  profileImageUrl: SafeUrl | null = null; 
constructor(private readonly fileService: FileService, private  readonly sanitizer: DomSanitizer) {}
  
   
  ngOnInit(): void {
    this.loadUserData();
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
          this.loadProfileImage(this.user.image); 
        } 
        if (this.user.telephoneNumber) {
          console.log(" numéro de téléphone trouvé !",this.user.telephoneNumber);
        }
        else {
          console.warn("Aucune image trouvée dans le token !");
        }
  
  
        
  
      } catch (error) {
        console.error("Erreur lors du décodage du token :", error);
      }
    }
  
    loadProfileImage(filename: string): void {
      this.fileService.getImage(filename).subscribe({
        next: (imageBlob) => {
          const objectURL = URL.createObjectURL(imageBlob);   
          this.profileImageUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL); 
        },
        error: (err) => {
          console.error('Erreur de chargement de l\'image', err);
          this.profileImageUrl = null; 
        }
      });
    }

}
