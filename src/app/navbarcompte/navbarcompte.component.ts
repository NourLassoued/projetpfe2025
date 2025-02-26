import { Component } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FileService } from '../service/file.service';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbarcompte',
  templateUrl: './navbarcompte.component.html',
  styleUrls: ['./navbarcompte.component.css']
})
export class NavbarcompteComponent {
   user: any = null;
    profileImageUrl: SafeUrl | null = null; 
  
    constructor(private fileService: FileService, private sanitizer: DomSanitizer, private router: Router) {}
    ngOnInit(): void {
      this.loadUserData();
      this.setupMenuToggle();
    }
    loadUserData(): void {
      const token = localStorage.getItem('accessToken');
    
      if (token) {
        try {
          const decodedToken: any = jwtDecode(token);
          this.user = decodedToken;
    
        
    
          if (this.user.image) {
           
            this.loadProfileImage(this.user.image);
          } else {
            console.warn("⚠ Aucune image trouvée dans le token !");
          }
        } catch (error) {
          console.error('🚨 Erreur lors du décodage du token:', error);
        }
      } else {
        console.warn("⚠ Aucun token trouvé dans localStorage !");
      }
    }
  
    loadProfileImage(filename: string): void {
      this.fileService.getImage(filename).subscribe({
        next: (imageBlob) => {
          const objectURL = URL.createObjectURL(imageBlob);
          this.profileImageUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        },
        error: (err) => {
          console.error('❌ Erreur de chargement de l\'image', err);
          this.profileImageUrl = null; 
        }
      });
    }
  
   
  setupMenuToggle(): void {
    const menuIcon = document.getElementById('menu-icon');
    const profileMenu = document.getElementById('profile-menu');
    const logoutButton = document.getElementById('logout-btn'); 

    if (menuIcon && profileMenu) {
      menuIcon.addEventListener('click', () => {
        profileMenu.classList.toggle('active');
      });
    }

    if (logoutButton) {
      logoutButton.addEventListener('click', () => this.logout()); 
    }
  }

  logout(): void {
  
    localStorage.removeItem('accessToken')
    this.router.navigate(['/Front']); 
  }
}

