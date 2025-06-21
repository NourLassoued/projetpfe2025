import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { ToastrService } from 'ngx-toastr';
import { CategorieService } from 'src/app/service/categorie.service';
import { FileService } from 'src/app/service/file.service';
import { ServiceeService } from 'src/app/service/servicee.service';

@Component({
  selector: 'app-meunuadmin',
  templateUrl: './meunuadmin.component.html',
  styleUrls: ['./meunuadmin.component.css']
})
export class MeunuadminComponent {
  user: any;
  profileImageUrl: SafeUrl | null = null;
  constructor(
    private fileservice: FileService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private categorieService: CategorieService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private service: ServiceeService) {


  }

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
  toggleComment(avis: any) {
    avis.isExpanded = !avis.isExpanded;
  }
  showDetails(avis: any) {
    console.log(avis);
  }

}
