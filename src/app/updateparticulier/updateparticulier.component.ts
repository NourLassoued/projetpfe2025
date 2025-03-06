import { Component, ElementRef, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FileService } from '../service/file.service';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdresseService } from '../service/adresse.service';
import { ForgetPasswordService } from '../service/forget-password.service';
import { Router } from '@angular/router';
import { UtilisateurService } from '../service/utilisateur.service';
import { Adresse } from 'src/models/Adresse';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-updateparticulier',
  templateUrl: './updateparticulier.component.html',
  styleUrls: ['./updateparticulier.component.css']
})
export class UpdateparticulierComponent {
    @ViewChild('fileInput') fileInput!: ElementRef;
  triggerFileInput() {
    this.fileInput.nativeElement.click(); 
  }
  selectedFile: File | null = null;
  isEditing: { [key: string]: boolean } = {};
editedValues: { [key: string]: string } = {}; 
userId: number | null = null;
 profileImageUrl: SafeUrl | null = null; 
 selectedFiles: { [key: string]: File } = {};  
 passwordData = {
  oldPassword: '',
  password: '',
  repeatPassword: ''
 
};
selectedAdresse: any;
  adresses: Adresse[] = [];
  user: any = null;
  imageUrls: string[] = [];
  
constructor(private fileService: FileService, private sanitizer: DomSanitizer, private router: Router,private utilisateurService:UtilisateurService,

  private toastr: ToastrService,private snackBar: MatSnackBar,
 private forgetPasswordService:ForgetPasswordService,
private uploadService :FileService,private adreesse:AdresseService) {}

   loadAdresses(): void {
     this.adreesse.getAllAdresses().subscribe((data) => {
       this.adresses = data;
     });
   }
 
   loadProfileImage(filename: string): void {
     this.fileService.getImage(filename).subscribe({
       next: (imageBlob) => {
         const objectURL = URL.createObjectURL(imageBlob);
         this.profileImageUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
       },
       error: (err) => {
         console.error(' Erreur de chargement de l\'image', err);
         this.profileImageUrl = null; 
       }
     });
   }
   
 
   loadUserData(): void {
     const token = localStorage.getItem('accessToken');
   
     if (!token) {
       console.error(" Aucun token trouvé !");
       return;
     }
   
     try {
       const decodedToken: any = jwtDecode(token);
   
       if (!decodedToken.id) {
         console.error(" L'ID utilisateur est introuvable dans le token !");
         return;
       }
   
       this.user = decodedToken;
       this.userId = decodedToken.id;
     if (this.user.image) {
         this.loadProfileImage(this.user.image);
       } else {
         console.warn(" Aucune image trouvée dans le token !");
       }
   
     } catch (error) {
       console.error("Erreur lors du décodage du token :", error);
     }


    }

onFileSelected(event: any) {
  const file = event.target.files[0];
  if (file) {
    this.selectedFile = file;
    this.updateProfileImage(); 
  }
}

  
getImage(filename: string, index: number) {
  this.fileService.getImage(filename).subscribe(
    (imageBlob) => {
      const imageUrl = URL.createObjectURL(imageBlob);
      this.imageUrls[index] = imageUrl;
     
    },
    (error) => {
      console.error('Erreur lors du chargement de l\'image', error);
    }
  );
}
updateProfileImage() {
  this.loadUserData(); 
  if (!this.userId) {
    console.error(" Impossible de mettre à jour : ID utilisateur introuvable !");
    return;
  }

  if (!this.selectedFile) {
    console.error("Aucun fichier sélectionné !");
    return;
  }

  this.uploadService.uploadFile(this.selectedFile).subscribe({
    next: (imageUrl) => {
     

      this.utilisateurService.updateUser(Number(this.userId), { image: imageUrl })
        .subscribe({
          next: (response) => {
          
            this.profileImageUrl = imageUrl;
        
            this.isEditing['profileImage'] = false;
            const updatedImageUrl = `http://localhost:8088/nour/api/v1/auth/get-image/${imageUrl}?t=${new Date().getTime()}`;
            this.profileImageUrl = updatedImageUrl;

          
            this.fileService.updateProfileImage(updatedImageUrl);

            if (response.token) {
              localStorage.removeItem('accessToken');
              localStorage.setItem('accessToken', response.token);
            
            }
            this.loadUserData();
          },
          error: (err) => {
            console.error(" Erreur lors de la mise à jour du profil :", err);
          }
        });
    },
    error: (err) => {
      console.error("Erreur lors de l'upload :", err);
    }
  });
}

}
   
   
  
 
   


