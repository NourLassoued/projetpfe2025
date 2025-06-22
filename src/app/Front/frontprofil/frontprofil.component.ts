import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AvisService } from 'src/app/service/avis.service';
import { FileService } from 'src/app/service/file.service';
import { UtilisateurService } from 'src/app/service/utilisateur.service';
import { Utilisateur } from 'src/models/Utilisateur';

@Component({
  selector: 'app-frontprofil',
  templateUrl: './frontprofil.component.html',
  styleUrls: ['./frontprofil.component.css']
})
export class FrontprofilComponent {
  scoreMap: { [id: number]: number } = {};
nombreAvisMap: { [id: number]: number } = {};

  prestataires: Utilisateur[] = [];
    constructor(private  readonly utilisateurService: UtilisateurService,
      private  readonly fileservice:FileService,
      private readonly  aviservice:AvisService,
      private readonly router: Router

      
    ){}


 
 ngOnInit(): void {
 
    this.getAllPrestataires(); 

 
  }




  getAllPrestataires(): void {
    this.utilisateurService.getPrestataires().subscribe({
      next: (data) => {
      
        this.prestataires = data
          .slice(0, 8)
          .map(prestataire => ({
            ...prestataire,
            disponibilites: prestataire.disponibilite ?? [],
            showFullDescription: false,
            servicesOfferts: prestataire.servicesOfferts
              ? prestataire.servicesOfferts.map(service => ({
                  ...service,
                  nomservice: service.nomservice ? service.nomservice.replace(/[\r\n]+/g, '').trim() : ''
                }))
              : [],
            profileImageUrl: null,
            adresse: prestataire.adressee ? prestataire.adressee.governoate : '',
          }));
  
      
  
        this.prestataires.forEach(utilisateur => {
        
          if (utilisateur.image) {
            this.loadProfileImage(utilisateur);
          }
  
       
          if (utilisateur.idUtilisateur !== undefined) {
            const idUtilisateur = utilisateur.idUtilisateur;
  
            this.aviservice.getScoreMoyen(idUtilisateur).subscribe({
              next: (score) => {
                if (score !== undefined && score !== null) {
                  this.scoreMap[idUtilisateur] = score;
                 
                }
              },
              error: (err) => {
                console.error(`Erreur lors de la récupération du score pour l'utilisateur ${idUtilisateur}`, err);
              }
            });
  
            this.aviservice.getNombreAvisPourUtilisateur(idUtilisateur).subscribe({
              next: (nombreAvis) => {
                this.nombreAvisMap[idUtilisateur] = nombreAvis;
              
              },
              error: (err) => {
                console.error(`Erreur lors de la récupération du nombre d'avis pour l'utilisateur ${idUtilisateur}`, err);
              }
            });
  
          } else {
            console.warn("idUtilisateur est undefined pour l'utilisateur :", utilisateur);
          }
        });
      },
      error: (error) => {
        console.error('Erreur lors du chargement des prestataires', error);
      }
    });
  }
  
    loadProfileImage(prestataire: any): void {
      if (prestataire.image) {
        this.fileservice.getImage(prestataire.image).subscribe({
          next: (imageBlob) => {
            const objectURL = URL.createObjectURL(imageBlob);
            prestataire.image = objectURL; 
          },
          error: () => {
            prestataire.image = 'assets/images/user.png'; 
          }
        });
      }
  
  
    }

}
