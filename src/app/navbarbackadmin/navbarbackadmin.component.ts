import { ChangeDetectorRef, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FileService } from '../service/file.service';
import { SafeUrl } from '@angular/platform-browser';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-navbarbackadmin',
  templateUrl: './navbarbackadmin.component.html',
  styleUrls: ['./navbarbackadmin.component.css']
})
export class NavbarbackadminComponent {


  profileImage: string | null = null;
  user: any;
  profileImageUrl: SafeUrl | null = null;


  image: SafeUrl | null = null;
  sanitizer: any;




  constructor(public dialog: MatDialog,
    private readonly fileservice: FileService,

    private readonly cdr: ChangeDetectorRef,
    private readonly router: Router) { }



  logout(): void {

    localStorage.removeItem('accessToken')
    this.router.navigate(['/Front']);
  }
  ngOnInit(): void {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      this.user = decodedToken;
      if (this.user.image) {
        this.loadProfileImagee(this.user.image);
        console.log(this.user.image);
      }
    } else {
      console.warn("Aucun token trouvé !");
    }

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
        this.loadProfileImagee(this.user.image);
      }

      else {
        console.warn("Aucune image trouvée dans le token !");
      }




    } catch (error) {
      console.error("Erreur lors du décodage du token :", error);
    }
  }
  loadProfileImagee(imagePath: string): void {
    if (!imagePath) {
      this.profileImageUrl = 'assets/images/user.png'; 
      return;
    }

    this.fileservice.getImage(imagePath).subscribe({
      next: (imageBlob) => {
        const objectURL = URL.createObjectURL(imageBlob);
        this.profileImageUrl = objectURL;
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error("Erreur lors du chargement de l'image :", err);
        this.profileImageUrl = 'assets/images/user.png';
      }
    });
  }
  handleDropdownKey(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggleDropdown();
    }
  }
  toggleDropdown() {
    throw new Error('Method not implemented.');
  }

}
