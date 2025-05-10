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
import { FrontprofilComponent } from './Front/frontprofil/frontprofil.component';
import { FrontprofilshowComponent } from './frontprofilshow/frontprofilshow.component';
import { AvissectionComponent } from './Front/avissection/avissection.component';
import { FrontpresayitrComponent } from './Front/frontpresayitr/frontpresayitr.component';
import { EspaceavisComponent } from '../backadmin/espaceavis/espaceavis.component';
import { MeunuadminComponent } from 'src/backadmin/meunuadmin/meunuadmin.component';
import { ScorebadageComponent } from '../backadmin/scorebadage/scorebadage.component';
import { EspacereservationComponent } from '../backadmin/espacereservation/espacereservation.component';
import { PaymentComponent } from './payment/payment.component';
import { MesrevunesComponent } from './mesrevunes/mesrevunes.component';
import { MestransactionsComponent } from './mestransactions/mestransactions.component';
import { SectionentrpriseComponent } from './sectionentrprise/sectionentrprise.component';
import { EntrepriseconnecteComponent } from './entrepriseconnecte/entrepriseconnecte.component';
import { ComptentrepriseComponent } from './comptentreprise/comptentreprise.component';
import { MespublicationComponent } from './mespublication/mespublication.component';
import { ConsulterentrpriseComponent } from './consulterentrprise/consulterentrprise.component';
import { CommentairesRecusComponent } from './commentaires-recus/commentaires-recus.component';
import { MesevolutionentrpriseComponent } from './mesevolutionentrprise/mesevolutionentrprise.component';


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
  // /////////////////////Front//////////////////
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
  { path: 'create-payment',
     component: PaymentComponent },
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
    path: 'avisection',
    component:AvissectionComponent 
  },
  {
    path: 'devenirprestataire',
    component:FrontpresayitrComponent 
  },
  {
    path: 'Frontprofil',
    component:FrontprofilComponent 
  },
  {
    path: 'Compte/:id',
    component:FrontprofilshowComponent 
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
    path: 'Mesrevunes',
    component:MesrevunesComponent
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

  //////espace admin
  {
    path: 'Admindashboard',
    component:AdmindashboardComponent
  },
  {
    path: 'espaceavis',
    component:EspaceavisComponent 
  },
  
  {
    path: 'adminmenu',
    component:MeunuadminComponent 
  },
  {
    path: 'Scorebadage',
    component:ScorebadageComponent 
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
    path: 'Service',
    component:ServiceComponent
  },
  
  {
    path: 'escpacereservation',
    component:EspacereservationComponent
  },
  {
    path: 'Sectionentrprise',
    component:SectionentrpriseComponent
  },
  {
    path: 'Contactentreprise/:id',
        component:EntrepriseconnecteComponent
  },

/////////////////////////////////////entrpriser//////////////////////////////////////


{
  path: 'Mesevolutionentrprise',
  component:MesevolutionentrpriseComponent
},
{
  path: 'mes-publications',
  component:MespublicationComponent
},
{
  path: 'Comptentreprise',
  component:ComptentrepriseComponent
},
{
  path: 'commentaires-recus',
  component:CommentairesRecusComponent
},


  {
    path: 'Profileentreprise',
    component:ProfiletrpriseComponent
  },
  {
    path: 'ConsulterEntreprise/:id',
    component:ConsulterentrpriseComponent
  },
  {
    path: 'UpdateEntreprise',
    component:UpdateEtrepriseComponent
  },
 /////////

  //////////////////////////////gestion de partculier//////////////////

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
                path: 'Mestransactions',
                component: MestransactionsComponent 
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
  },
 
  









];
@NgModule({
  imports: [  RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',  
    anchorScrolling: 'enabled',           
  })
],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }
  
  