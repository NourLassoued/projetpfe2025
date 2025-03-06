import { AfterViewInit, Component } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FileService } from '../service/file.service';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { AuthServiceService } from '../service/auth-service.service';
import { I } from '@fullcalendar/core/internal-common';

@Component({
  selector: 'app-navbarcompte',
  templateUrl: './navbarcompte.component.html',
  styleUrls: ['./navbarcompte.component.css']
})
export class NavbarcompteComponent implements    AfterViewInit {
  isMenuOpen: boolean = true;
     user: any = null;
    profileImageUrl: SafeUrl | null = null; 
    userRole: string | null = null;
    constructor(private fileService: FileService, private sanitizer: DomSanitizer, private router: Router,private authServiceService:AuthServiceService) {}
    
    ngAfterViewInit(): void {
    this.toggleMenu();
      
    }
    ngOnInit(): void {
      this.userRole = this.authServiceService.getUserRole();
      this.loadUserData();
   
    
      this.fileService.profileImage$.subscribe((newImageUrl) => {
        if (newImageUrl) {
          this.profileImageUrl = this.sanitizer.bypassSecurityTrustUrl(newImageUrl);
          console.log(" Nouvelle image reçue dans la navbar :", newImageUrl);
        }
      });
    
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
  
    toggleMenu(): void {
      this.isMenuOpen = !this.isMenuOpen; // Change l'état de isMenuOpen (affiché ou caché)
    }


  logout(): void {
  
    localStorage.removeItem('accessToken')
    this.router.navigate(['/Front']); 
  }
 }
  
  


