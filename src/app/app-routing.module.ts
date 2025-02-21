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
import { InscriptionEntrpriseComponent } from './inscription-entrprise/inscription-entrprise.component';
import { LoginComponent } from './login/login.component';
import { NewinstructionssendComponent } from './newinstructionssend/newinstructionssend.component';
import { EditpasswordComponent } from './editpassword/editpassword.component';


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
    path: 'InscriptionEntrprise',
    component: InscriptionEntrpriseComponent
  },
  {
    path: 'footer',
    component: FooterComponent
  },
  {
    path: 'inscription',
    component: InscriptionComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'new',
    component:  NewinstructionssendComponent
  },
  {
    path: 'editpassword',
    component:EditpasswordComponent
  }
 
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }
  
  