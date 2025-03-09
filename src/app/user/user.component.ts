import { Component, OnInit } from '@angular/core';
import { Utilisateur } from 'src/models/Utilisateur';
import { UtilisateurService } from '../service/utilisateur.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  prestataires: Utilisateur[] = [];

  constructor(private utilisateurService: UtilisateurService) {}

  ngOnInit(): void {
    this.getAllUsgetPrestatairesers(); // Appel automatique lors du chargement du composant
  }

  getAllUsgetPrestatairesers(): void {
    this.utilisateurService.getPrestataires().subscribe(
      (data) => {
        this.prestataires = data.map(prestataire => ({
          ...prestataire,
          showFullDescription: false  ,
          servicesOfferts: prestataire.servicesOfferts 
          ? prestataire.servicesOfferts.map(service => ({
              ...service,
              nomservice: service.nomservice ? service.nomservice.replace(/[\r\n]+/g, '').trim() : ''
            }))
          : []
      }));
    },
      (error) => {
        console.error('Erreur lors du chargement des prestataires', error);
      }
    );
  }

  getShortDescription(description?: string): string {
    return description ? description.substring(0, 100) + '...' : '';  // Affiche les 100 premiers caractères
  }
  toggleDescription(prestataire: Utilisateur): void {
    prestataire.showFullDescription = !prestataire.showFullDescription;
  }
}

