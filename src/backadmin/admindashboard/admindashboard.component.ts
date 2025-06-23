import { ChangeDetectorRef, Component } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { FileService } from '../../app/service/file.service';
import { SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admindashboard',
  templateUrl: './admindashboard.component.html',
  styleUrls: ['./admindashboard.component.css']
})
export class AdmindashboardComponent {
  profileImage: string | null = null;
  user: any;
  profileImageUrl: SafeUrl | null = null;
  constructor(
    private readonly fileservice: FileService,
    private readonly cdr: ChangeDetectorRef,
    private readonly router: Router) { }
  ngOnInit(): void {

    this.loadUserData();
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
      if (this.user.telephoneNumber) {
        console.log(" numéro de téléphone trouvé !", this.user.telephoneNumber);
      }
      else {
        console.warn("Aucune image trouvée dans le token !");
      }




    } catch (error) {
      console.error("Erreur lors du décodage du token :", error);
    }
  }
  logout(): void {

    localStorage.removeItem('accessToken')
    this.router.navigate(['/Front']);
  }

}
