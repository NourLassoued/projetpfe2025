import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


import { AppComponent } from './app.component';


import { RouterModule, Routes } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { AllTemplateFrontComponent } from './Front/all-template-front/all-template-front.component';
import { FooterComponent } from './footer/footer.component';
import { InscriptionComponent } from './gestionUtilisateur/inscription/inscription.component';
import { InscriptionprestaitreComponent } from './inscriptionprestaitre/inscriptionprestaitre.component';
import { InscriptionEntrpriseComponent } from './gestionUtilisateur/inscription-entrprise/inscription-entrprise.component';
import { LoginComponent } from './login/login.component';
import { NewinstructionssendComponent } from './Front/newinstructionssend/newinstructionssend.component';
import { EditpasswordComponent } from './gestionUtilisateur/editpassword/editpassword.component';
import { CompteprestaitreComponent } from './compteprestaitre/compteprestaitre.component';
import { UpdateprofileprestaitreComponent } from './updateprofileprestaitre/updateprofileprestaitre.component';
import { NavbarcompteComponent } from './navbarcompte/navbarcompte.component';
import { ProfileUtilisateurComponent } from './profile-utilisateur/profile-utilisateur.component';
import { ComptepartuculierComponent } from './comptepartuculier/comptepartuculier.component';
import { ProfileparticulierComponent } from './profileparticulier/profileparticulier.component';
import { UpdateparticulierComponent } from './updateparticulier/updateparticulier.component';
import { AdmindashboardComponent } from '../backadmin/admindashboard/admindashboard.component';

import { UserComponent } from '../backadmin/user/user.component';
import { ProfiletrpriseComponent } from './profiletrprise/profiletrprise.component';
import { UpdateEtrepriseComponent } from './update-etreprise/update-etreprise.component';
import { CatogoriesComponent } from '../backadmin/catogories/catogories.component';
import { ServiceComponent } from './service/service.component';
import { BricolageComponent } from './Front/bricolage/bricolage.component';
import { MenageComponent } from './Front/menage/menage.component';
import { JardinageComponent } from './Front/jardinage/jardinage.component';
import { EnfantsComponent } from './Front/enfants/enfants.component';
import { DemenagementComponent } from './demenagement/demenagement.component';
import { AidedomicileComponent } from './Front/aidedomicile/aidedomicile.component';
import { AnimauxComponent } from './Front/animaux/animaux.component';
import { InformatiqueComponent } from './Front/informatique/informatique.component';
import { CoursparticuliersComponent } from './Front/coursparticuliers/coursparticuliers.component';
import { ConstructionetGrosoeuvreComponent } from './Front/constructionet-grosoeuvre/constructionet-grosoeuvre.component';
import { DecorationComponent } from './Front/decoration/decoration.component';
import { SecuriteComponent } from './securite/securite.component';
import { DemandeComponent } from './demande/demande.component';
import { DemandecompteComponent } from './demandecompte/demandecompte.component';
import { MesdemandesComponent } from './mesdemandes/mesdemandes.component';
import { GererdemandeComponent } from './gererdemande/gererdemande.component';
import { ProfilComponent } from './profil/profil.component';
import { DemandeterminneComponent } from './demandeterminne/demandeterminne.component';
import { DemandecompletedComponent } from './demandecompleted/demandecompleted.component';
import { ReservationComponent } from './reservation/reservation.component';
import { ReservationcoursComponent } from './reservationcours/reservationcours.component';
import { HistoriqueComponent } from './historique/historique.component';
import { PostulationComponent } from './postulation/postulation.component';
import { ReservationprestaitreComponent } from './reservationprestaitre/reservationprestaitre.component';
import { MesevolutiosComponent } from './mesevolutios/mesevolutios.component';
import { MesevolutiosprestaitreComponent } from './mesevolutiosprestaitre/mesevolutiosprestaitre.component';
import { InscriptionProfessionnelComponent } from './gestionUtilisateur/inscription-professionnel/inscription-professionnel.component';
import { ChatComponent } from './chat/chat.component';


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
  },
  {
    path: 'Service',
    component:ServiceComponent
  },
  {
    path: 'Bricolage',
    component:BricolageComponent
  },
  {
    path: 'Ménage',
    component:MenageComponent
  },
  

  {
    path: 'Jardinage',
    component:JardinageComponent
  },
  {
    path: 'Enfants',
    component:EnfantsComponent
  },
  {
  path: 'Demenagement',
  component:DemenagementComponent
},
{
  path: 'aide-a-domicile',
  component:AidedomicileComponent
},
{
  path: 'Animaux',
  component:AnimauxComponent
},
{
path: 'Informatique',
component:InformatiqueComponent
},
{
  path: 'Coursparticuliers',
  component:CoursparticuliersComponent  
  },
  {
    path: 'Decoration',
    component:DecorationComponent  
  },
  {
    path: 'Construction',
    component:ConstructionetGrosoeuvreComponent  
  },
  {
    path: 'Domotique',
    component:SecuriteComponent 
  },
  {
    path: 'Demande',
    component:DemandeComponent 
  },
  
  {
    path: 'Demandeservice',
    component:DemandecompteComponent 
  },
  {
    path: 'Mesdemandes',
    component:MesdemandesComponent 
  },
  {
        path: 'Mesdemandesarchivees',
        component: DemandeterminneComponent 
          },
          {
            path: 'Mesdemandeterminees',
            component: DemandecompletedComponent 
              },
{
    path: 'gerer-demande',
    component:GererdemandeComponent ,
   
  },
  {
    path: 'Profil/:id',
    component:ProfilComponent 
  },
  {
    path: 'Reservation/:idDemande',
    component:ReservationComponent 
  },
  {
    path: 'Reservationcours',
    component:ReservationcoursComponent 
  },
  {
    path: 'Historique',
    component:HistoriqueComponent 
  },
  {
    path: 'Postulation',
    component:PostulationComponent 
  },
  {
    path: 'reservationprestataire',
    component:ReservationprestaitreComponent 
  },
  {
    path: 'Mesévolutions',
    component:MesevolutiosComponent 
  },
  {
    path: 'Mesevolutions',
    component:MesevolutiosprestaitreComponent 
  },
  {
    path: 'Chat',
    component:ChatComponent 
  }







];
@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })], 
    exports: [RouterModule]
  })
  export class AppRoutingModule { }
  
  