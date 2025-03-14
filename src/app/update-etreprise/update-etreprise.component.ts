import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FileService } from '../service/file.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { ForgetPasswordService } from '../service/forget-password.service';
import { AdresseService } from '../service/adresse.service';
import { jwtDecode } from 'jwt-decode';
import { Adresse } from 'src/models/Adresse';
import { Utilisateur } from 'src/models/Utilisateur';

import { Router } from '@angular/router';
import { UtilisateurService } from '../service/utilisateur.service';

@Component({
  selector: 'app-update-etreprise',
  templateUrl: './update-etreprise.component.html',
  styleUrls: ['./update-etreprise.component.css']
})
export class UpdateEtrepriseComponent implements OnInit {



  @ViewChild('fileInput') fileInput!: ElementRef;

triggerFileInput() {
  this.fileInput.nativeElement.click(); // Simule un clic sur l'input file
}

emailExists: boolean = false;
emailError: string | null = null; 
email: string = '';
 
  passwordData = {
    oldPassword: '',
    password: '',
    repeatPassword: ''
  };
  selectedAdresse: any;  

  passwordError = '';
  selectedFile: File | null = null;
  isEditing: { [key: string]: boolean } = {};
editedValues: { [key: string]: string } = {}; 
userId: number | null = null;
  user: any = null;
  adresses: Adresse[] = [];
  profileImageUrl: SafeUrl | null = null; 
  user1: Utilisateur = { servicesOfferts: [] };
 
 
  utilisateurId!: number;
   private apiUrl = 'http://localhost:8088/nour/api/v1/auth';


  soumis: boolean = false;
  selectedFiles: { [key: string]: File } = {};  
  imageUrls: string[] = [];
  editionActive = false;
  isAddingNewDisponibilite: boolean = false;

modificationMode = false; 
  ajoutMode = false;

   

  constructor(private fileService: FileService, private sanitizer: DomSanitizer, private router: Router,private utilisateurService:UtilisateurService,private cdr: ChangeDetectorRef,
   
   private cdRef: ChangeDetectorRef,
   private forgetPasswordService:ForgetPasswordService,
  private uploadService :FileService,private adreesse:AdresseService) {}
  
  ngOnInit(): void {
   
    this.loadAdresses();
      this.loadUserData();
    
  
     
      
     
  
      const token = localStorage.getItem('accessToken');
      if (token) {
        const decodedToken: any = jwtDecode(token);
       
    
        if (decodedToken.services && Array.isArray(decodedToken.services)) {
          this.user1.servicesOfferts = decodedToken.services.map((service: string) => ({
            idservice: null,  
            nomservice: service.replace(/[\r\n]+/g, '').trim() 
          }));
         
        } else {
          console.warn(" Aucun service trouvé dans le token !");
        }
      }
    }
    
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
     
  startEditing(field: string, currentValue: string) {
    this.isEditing[field] = true;
    this.editedValues[field] = currentValue;
  }
 saveChanges(field: string) {
  if (!this.userId) {
    console.error(" Impossible de mettre à jour : ID utilisateur introuvable !");
    return;
  }
  if (field === "profileImage" && this.selectedFile) {
    this.updateProfileImage();
    return;
  }
  
  if (field === "password") {
    const newPassword = this.editedValues['password'];
    const confirmPassword = this.editedValues['confirmPassword'];

    if (!newPassword || !confirmPassword) {
      this.passwordError = "Veuillez remplir tous les champs.";
      return;
    }

    if (newPassword.length < 6) {
      this.passwordError = "Le mot de passe doit contenir au moins 6 caractères.";
      return;
    }

    if (newPassword !== confirmPassword) {
      this.passwordError = "Les mots de passe ne correspondent pas.";
      return;
    }

   
    this.forgetPasswordService.changePassword(this.userId, this.editedValues['password'], this.editedValues['confirmPassword'])
      .subscribe({
        next: (response) => {
         
          this.isEditing[field] = false;
          this.passwordError = "";
        },
        error: (err) => {
          console.error("Erreur lors du changement de mot de passe :", err);
          this.passwordError = err.error || "Une erreur est survenue.";
        }
      });

    return;
  }
 
 
  if (field === "adresse") {
    if (!this.selectedAdresse) {
      console.error("Aucune adresse sélectionnée !");
      return;
    }

    // Vérifier si `selectedAdresse` est un objet ou une chaîne (nom de la ville)
    let adresseObjet = typeof this.selectedAdresse === 'string'
      ? this.adresses.find(a => a.governoate === this.selectedAdresse)
      : this.selectedAdresse;

    if (!adresseObjet || !adresseObjet.idAdresse) {
      console.error(" Adresse introuvable !");
      return;
    }

    this.utilisateurService.affecterAdresse(this.userId, adresseObjet.idAdresse)
      .subscribe({
        next: (response: { token: string; }) => {
          console.log(` ${field} mis à jour avec succès :`, response);
  
          if (response.token) {
            localStorage.removeItem('accessToken'); 
            localStorage.setItem('accessToken', response.token); 
       
          }
          this.user.adresse = adresseObjet;
          this.isEditing[field] = false;
      
          
        },
        error: (err: any) => {
          console.error(" Erreur lors de la mise à jour de l'adresse :", err);
        }
      });
  }


  
  const updatedData = { [field]: this.editedValues[field] };

  this.utilisateurService.updateUser(this.userId, updatedData)
    .subscribe({
      next: (response: { token: string; }) => {
        console.log(` ${field} mis à jour avec succès :`, response);

        if (response.token) {
          localStorage.removeItem('accessToken'); 
          localStorage.setItem('accessToken', response.token); 
     
        }

        this.user[field] = updatedData[field]; 
        this.isEditing[field] = false; 
      },
      error: (err: any) => {
        console.error(`Erreur lors de la mise à jour de ${field} :`, err);
      }
    });
}
ouvrirEdition(dispo?: any) {
  this.editionActive = true;

}

fermerEdition() {
  this.editionActive = false;

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
          next: (response: { token: string; }) => {
          
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
          error: (err: any) => {
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


 
 


    
   
  
    
  


