import { ChangeDetectorRef, Component } from '@angular/core';
import { FileService } from '../../app/service/file.service';
import { Router } from '@angular/router';
import { AvisService } from '../../app/service/avis.service';
import { ToastrService } from 'ngx-toastr';
import { jwtDecode } from 'jwt-decode';
import { SafeUrl } from '@angular/platform-browser';
import { Avis } from 'src/models/Avis';

@Component({
  selector: 'app-scorebadage',
  templateUrl: './scorebadage.component.html',
  styleUrls: ['./scorebadage.component.css']
})
export class ScorebadageComponent {
  utilisateursScores: any[] = [];
  avis: Avis[] = [];
  scoreMap: Map<number, number> = new Map();
  user: any;
  profileImageUrl: SafeUrl | null = null;

  constructor(
    private fileservice: FileService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private avisService: AvisService,
    private toastr: ToastrService


  ) {


  }
  ngOnInit(): void {


    this.loadUserData();
    this.loadUtilisateurScores();

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

      }
      else {
        console.warn("Aucune image trouvée dans le token !");
      }




    } catch (error) {
      console.error("Erreur lors du décodage du token :", error);
    }
  }


  loadUtilisateurScores(): void {
    this.avisService.getScoresMoyens().subscribe({
      next: (data) => {
        this.utilisateursScores = [];

        data.forEach(user => {

          let imageUrl: string;
          if (user.image) {
            this.fileservice.getImage(user.image).subscribe({
              next: (imageBlob) => {

                imageUrl = URL.createObjectURL(imageBlob);

                this.utilisateursScores.push({
                  ...user,
                  imageUrl: imageUrl
                });
              },
              error: (err) => {
                console.error("Erreur lors du chargement de l'image :", err);
                this.utilisateursScores.push({
                  ...user,
                  imageUrl: 'assets/images/user.png'
                });
              }
            });
          } else {

            this.utilisateursScores.push({
              ...user,
              imageUrl: 'assets/images/user.png'
            });
          }
        });


      },
      error: (err) => {
        console.error("Erreur lors du chargement des scores :", err);
      }
    });
  }

  logout(): void {

    localStorage.removeItem('accessToken')
    this.router.navigate(['/Front']);
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
  getBadgeClass(badge: string): string {
    switch (badge) {
      case 'Superstar':
        return 'badge-superstar icon-star';
      case 'Excellent':
        return 'badge-excellent icon-medal';
      case 'Bon':
        return 'badge-bon icon-thumbs-up';
      case 'Moyenne':
        return 'badge-moyenne icon-trophy';
      case 'Faible':
        return 'badge-faible icon-sad-tear';
      default:
        return '';
    }
  }
  

}
