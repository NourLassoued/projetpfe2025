import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


import { AppComponent } from './app.component';


import { RouterModule, Routes } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { AllTemplateFrontComponent } from './all-template-front/all-template-front.component';
import { FooterComponent } from './footer/footer.component';
import { InscriptionComponent } from './inscription/inscription.component';
import { InscriptionprestaitreComponent } from './inscriptionprestaitre/inscriptionprestaitre.component';
import { InscriptionProfessionnelComponent } from './inscription-professionnel/inscription-professionnel.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'Front',
    pathMatch: 'full' 
  },
  {
    path: 'Front',
    component: AllTemplateFrontComponent
  },
  {
    path: 'prestataire',
    component: InscriptionprestaitreComponent
  },
  {
    path: 'InscriptionProfessionnel',
    component: InscriptionProfessionnelComponent
  },
  {
    path: 'footer',
    component: FooterComponent
  },
  {
    path: 'inscription',
    component: InscriptionComponent
  }
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }
  
  