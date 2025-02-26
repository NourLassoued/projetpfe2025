import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FileService } from '../service/file.service';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { Utilisateur } from 'src/models/Utilisateur';
import { Servicee } from 'src/models/Servicee';
import { UtilisateurService } from '../service/utilisateur.service';

@Component({
  selector: 'app-updateprofileprestaitre',
  templateUrl: './updateprofileprestaitre.component.html',
  styleUrls: ['./updateprofileprestaitre.component.css']
})
export class UpdateprofileprestaitreComponent implements OnInit{
  isEditing: { [key: string]: boolean } = {};
editedValues: { [key: string]: string } = {}; 
userId: number | null = null;
  user: any = null;
  profileImageUrl: SafeUrl | null = null; 
  user1: Utilisateur = { servicesOfferts: [] };
  constructor(private fileService: FileService, private sanitizer: DomSanitizer, private router: Router,private utilisateurService:UtilisateurService) {}
  ngOnInit(): void {
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
        console.warn("⚠️ Aucun service trouvé dans le token !");
      }
    }
  }
  

  loadUserData(): void {
    const token = localStorage.getItem('accessToken');
  
    if (!token) {
     
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
      console.error(" Erreur lors du décodage du token :", error);
    }
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

  startEditing(field: string, currentValue: string) {
    this.isEditing[field] = true;
    this.editedValues[field] = currentValue;
  }/*
  saveChanges(field: string) {
    if (!this.userId) {
      console.error(" Impossible de mettre à jour : ID utilisateur introuvable !");
      return;
    }
  
    if (this.user) {
      this.user[field as keyof Utilisateur] = this.editedValues[field];
  
      this.utilisateurService.updateUser(this.userId, this.user).subscribe({
        next: (updatedUser: Utilisateur) => {
          console.log(` Mise à jour du champ '${field}' réussie`, updatedUser);
  
       
          const token = localStorage.getItem('accessToken');
          if (token) {
            try {
              const decodedToken: any = jwtDecode(token);
              decodedToken[field] = updatedUser[field as keyof Utilisateur];
  
             
              const newToken = btoa(JSON.stringify(decodedToken));
              localStorage.setItem('accessToken', newToken);
           
            } catch (error) {
              console.error(" Erreur lors de la mise à jour du token :", error);
            }
          }
  
          this.isEditing[field] = false;
          this.loadUserData();
        },
        error: (error) => console.error(" Erreur de mise à jour", error)
      });
    }
  }*/saveChanges(field: string) {
  if (!this.userId) {
    console.error("❌ Impossible de mettre à jour : ID utilisateur introuvable !");
    return; // On arrête la fonction si userId est null
  }

  if (this.user) {
    this.user[field as keyof Utilisateur] = this.editedValues[field];

    this.utilisateurService.updateUser(this.userId, this.user).subscribe({
      next: () => {
        console.log(`✅ Mise à jour du champ '${field}' réussie`);

        // 🔥 Vérification avant d'appeler getUserById
        if (this.userId !== null) {
          this.utilisateurService.getById(this.userId).subscribe({
            next: (updatedUser: Utilisateur) => {
              console.log("✅ Nouvelles informations récupérées :", updatedUser);
              this.user = updatedUser;
             
              this.isEditing[field] = false;
            },
            error: (error) => console.error("❌ Erreur lors de la récupération des nouvelles données :", error)
          });
        }
      },
      error: (error) => console.error("❌ Erreur de mise à jour", error)
    });
  }
}
}