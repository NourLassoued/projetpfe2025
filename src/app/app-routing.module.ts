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
import { CompteprestaitreComponent } from './compteprestaitre/compteprestaitre.component';
import { UpdateprofileprestaitreComponent } from './updateprofileprestaitre/updateprofileprestaitre.component';
import { NavbarcompteComponent } from './navbarcompte/navbarcompte.component';
import { ProfileUtilisateurComponent } from './profile-utilisateur/profile-utilisateur.component';
import { ComptepartuculierComponent } from './comptepartuculier/comptepartuculier.component';
import { ProfileparticulierComponent } from './profileparticulier/profileparticulier.component';
import { UpdateparticulierComponent } from './updateparticulier/updateparticulier.component';
import { AdmindashboardComponent } from './admindashboard/admindashboard.component';

import { UserComponent } from './user/user.component';
import { ProfiletrpriseComponent } from './profiletrprise/profiletrprise.component';
import { UpdateEtrepriseComponent } from './update-etreprise/update-etreprise.component';
import { CatogoriesComponent } from './catogories/catogories.component';


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
  },
  {
    path: 'Compteprestaitre',
    component:CompteprestaitreComponent
  },
  
  {
    path: 'updateprestaitre',
    component:UpdateprofileprestaitreComponent
  },
  {
    path: 'navbarcompte',
    component:NavbarcompteComponent
  },
  {
    path: 'ProfileUtilisateur',
    component:ProfileUtilisateurComponent
  },
  {
    path: 'Compteparticulier',
    component:ComptepartuculierComponent
  },
  {
    path: 'Profileparticulier',
    component:ProfileparticulierComponent
  },
  {
    path: 'Updateparticulier',
    component:UpdateparticulierComponent
  },
  {
    path: 'Admindashboard',
    component:AdmindashboardComponent
  },
  {
    path: 'catogories',
    component:CatogoriesComponent
  },

  {
    path: 'user',
    component:UserComponent
  },
  {
    path: 'Profileentreprise',
    component:ProfiletrpriseComponent
  },
  {
    path: 'UpdateEntreprise',
    component:UpdateEtrepriseComponent
  }



];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }
  
  