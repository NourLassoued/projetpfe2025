import { NgModule ,LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';

import { DateFnsModule } from 'ngx-date-fns';
import { Stomp } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';

import { AppComponent } from './app.component';
import { MatDialogModule } from '@angular/material/dialog';
import { NavbarComponent } from './navbar/navbar.component';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AllTemplateFrontComponent } from './Front/all-template-front/all-template-front.component';
import { FooterComponent } from './footer/footer.component';
import { InscriptionComponent } from './gestionUtilisateur/inscription/inscription.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InscriptionprestaitreComponent } from './inscriptionprestaitre/inscriptionprestaitre.component';
import { HttpClientModule } from '@angular/common/http';
import { InscriptionEntrpriseComponent } from './gestionUtilisateur/inscription-entrprise/inscription-entrprise.component';
import { LoginComponent } from './login/login.component';
import { NewinstructionssendComponent } from './Front/newinstructionssend/newinstructionssend.component';
import { EditpasswordComponent } from './gestionUtilisateur/editpassword/editpassword.component';
import { registerLocaleData } from '@angular/common';
import { CompteprestaitreComponent } from './compteprestaitre/compteprestaitre.component';
import { UpdateprofileprestaitreComponent } from './updateprofileprestaitre/updateprofileprestaitre.component';
import { NavbarcompteComponent } from './navbarcompte/navbarcompte.component';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'

import { MatSnackBarModule } from '@angular/material/snack-bar'; // Importer MatSnackBar

import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { ToastrModule } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import timeGridWeek from '@fullcalendar/timegrid';
import { ProfileUtilisateurComponent } from './profile-utilisateur/profile-utilisateur.component';
import { NotificationService } from './service/notification.service';
import { ComptepartuculierComponent } from './comptepartuculier/comptepartuculier.component';
import { ProfileparticulierComponent } from './profileparticulier/profileparticulier.component';
import { UpdateparticulierComponent } from './updateparticulier/updateparticulier.component';
import { AdmindashboardComponent } from '../backadmin/admindashboard/admindashboard.component';



import { UserComponent } from '../backadmin/user/user.component';
import { DisponibiliteDialogComponent } from './disponibilite-dialog/disponibilite-dialog.component';
import { ProfiletrpriseComponent } from './profiletrprise/profiletrprise.component';
import { UpdateEtrepriseComponent } from './update-etreprise/update-etreprise.component';
import { NavbarbackadminComponent } from './navbarbackadmin/navbarbackadmin.component';
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
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { DemandecompteComponent } from './demandecompte/demandecompte.component';
import { MesdemandesComponent } from './mesdemandes/mesdemandes.component';
import { GererdemandeComponent } from './gererdemande/gererdemande.component';
import { MatMenuModule } from '@angular/material/menu';
import { ProfilComponent } from './profil/profil.component';
import { DemandeterminneComponent } from './demandeterminne/demandeterminne.component';
import { RouterModule } from '@angular/router';
import { DemandecompletedComponent } from './demandecompleted/demandecompleted.component';
import { ReservationComponent } from './reservation/reservation.component';
import { ReservationcoursComponent } from './reservationcours/reservationcours.component';
import { HistoriqueComponent } from './historique/historique.component';
import { PostulationComponent } from './postulation/postulation.component';
import { ReservationprestaitreComponent } from './reservationprestaitre/reservationprestaitre.component';
import { MesevolutiosComponent } from './mesevolutios/mesevolutios.component';
import { MesevolutiosprestaitreComponent } from './mesevolutiosprestaitre/mesevolutiosprestaitre.component';
import { InscriptionProfessionnelComponent } from './gestionUtilisateur/inscription-professionnel/inscription-professionnel.component';
import { WebsocketServiceService } from './service/websocket-service.service';
import { StompServiceService } from './service/stomp-service.service';
import { ChatComponent } from './chat/chat.component';
import { TimeAgoPipe } from './pipes/time-ago.pipe';
import { FrontprofilComponent } from './Front/frontprofil/frontprofil.component';
import { FrontprofilshowComponent } from './frontprofilshow/frontprofilshow.component';
import { AvissectionComponent } from './Front/avissection/avissection.component';
import { FrontpresayitrComponent } from './frontpresayitr/frontpresayitr.component';




@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    AllTemplateFrontComponent,
    FooterComponent,
    InscriptionComponent,
    InscriptionprestaitreComponent,
    InscriptionProfessionnelComponent,
    InscriptionEntrpriseComponent,
    LoginComponent,
    NewinstructionssendComponent,
    EditpasswordComponent,
    CompteprestaitreComponent,
    UpdateprofileprestaitreComponent,
    NavbarcompteComponent,
    ProfileUtilisateurComponent,
    ComptepartuculierComponent,
    ProfileparticulierComponent,
    UpdateparticulierComponent,
    AdmindashboardComponent,

    UserComponent,
    DisponibiliteDialogComponent,
    ProfiletrpriseComponent,
    UpdateEtrepriseComponent,
    NavbarbackadminComponent,
    CatogoriesComponent,
    ServiceComponent,
    BricolageComponent,
    MenageComponent,
    JardinageComponent,
    EnfantsComponent,
    DemenagementComponent,
    AidedomicileComponent,
    AnimauxComponent,
    InformatiqueComponent,
    CoursparticuliersComponent,
    ConstructionetGrosoeuvreComponent,
    DecorationComponent,
    SecuriteComponent,
    DemandeComponent,
    DemandecompteComponent,
    MesdemandesComponent,
    GererdemandeComponent,
    ProfilComponent,
    DemandeterminneComponent,
    DemandecompletedComponent,
    ReservationComponent,
    ReservationcoursComponent,
    HistoriqueComponent,
    PostulationComponent,
    ReservationprestaitreComponent,
    MesevolutiosComponent,
    MesevolutiosprestaitreComponent,
    ChatComponent,
    TimeAgoPipe,
    FrontprofilComponent,
    FrontprofilshowComponent,
    AvissectionComponent,
    FrontpresayitrComponent,
 
   

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatDialogModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    FullCalendarModule,
    MatSelectModule,
   
    MatOptionModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatMenuModule,
    DateFnsModule,
    BsDatepickerModule.forRoot() ,
   
    BrowserAnimationsModule, 
    ToastrModule.forRoot({
      timeOut: 3000, 
      positionClass: 'toast-top-right',
      preventDuplicates: true
    })
  ],
 
  
 
  
  providers: [  { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },
     NotificationService,
     WebsocketServiceService
     

     
   ],
  bootstrap: [AppComponent]
})
export class AppModule { }
