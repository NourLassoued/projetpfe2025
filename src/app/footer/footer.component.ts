import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  constructor(


    private readonly router: Router,

  ) { }


  categoryRoutes: { [key: string]: string } = {
    'Bricolage': '/Bricolage',
    'Ménage': '/Ménage',
    'Jardinage': '/Jardinage',
    'Animaux': '/Animaux',
    'Enfants': '/Enfants',
    'Déménagement': '/Demenagement',
    'Aide à domicile': '/aide-a-domicile',
    'Informatique': '/Informatique',
    'Cours particuliers': '/Coursparticuliers',
    'Construction et Gros oeuvre': '/Construction',
    'Décoration et Finitions': '/Decoration',
    'Sécurité et domotique': '/Domotique'
  };

  navigateToCategory(selectedCategory: { nom: string }) {
    const route = this.categoryRoutes[selectedCategory.nom];
    if (route) {
      this.router.navigateByUrl(route);
    } else {
      console.error('Route non définie pour cette catégorie:', selectedCategory.nom);
    }
  }


}