import { NgModule ,LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatDialogModule } from '@angular/material/dialog';
import { NavbarComponent } from './navbar/navbar.component';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AllTemplateFrontComponent } from './all-template-front/all-template-front.component';
import { FooterComponent } from './footer/footer.component';
import { InscriptionComponent } from './inscription/inscription.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InscriptionprestaitreComponent } from './inscriptionprestaitre/inscriptionprestaitre.component';
import { InscriptionProfessionnelComponent } from './inscription-professionnel/inscription-professionnel.component';
import { HttpClientModule } from '@angular/common/http';
import { InscriptionEntrpriseComponent } from './inscription-entrprise/inscription-entrprise.component';
import { LoginComponent } from './login/login.component';
import { NewinstructionssendComponent } from './newinstructionssend/newinstructionssend.component';
import { EditpasswordComponent } from './editpassword/editpassword.component';
import { registerLocaleData } from '@angular/common';
import { CompteprestaitreComponent } from './compteprestaitre/compteprestaitre.component';
import { UpdateprofileprestaitreComponent } from './updateprofileprestaitre/updateprofileprestaitre.component';
import { NavbarcompteComponent } from './navbarcompte/navbarcompte.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
import { AdmindashboardComponent } from './admindashboard/admindashboard.component';

import { UserComponent } from './user/user.component';
import { DisponibiliteDialogComponent } from './disponibilite-dialog/disponibilite-dialog.component';
import { ProfiletrpriseComponent } from './profiletrprise/profiletrprise.component';
import { UpdateEtrepriseComponent } from './update-etreprise/update-etreprise.component';
import { NavbarbackadminComponent } from './navbarbackadmin/navbarbackadmin.component';
import { CatogoriesComponent } from './catogories/catogories.component';
import { ServiceComponent } from './service/service.component';
import { BricolageComponent } from './bricolage/bricolage.component';
import { MenageComponent } from './menage/menage.component';
import { JardinageComponent } from './jardinage/jardinage.component';
import { EnfantsComponent } from './enfants/enfants.component';
import { DemenagementComponent } from './demenagement/demenagement.component';
import { AidedomicileComponent } from './aidedomicile/aidedomicile.component';
import { AnimauxComponent } from './animaux/animaux.component';
import { InformatiqueComponent } from './informatique/informatique.component';
import { CoursparticuliersComponent } from './coursparticuliers/coursparticuliers.component';
import { ConstructionetGrosoeuvreComponent } from './constructionet-grosoeuvre/constructionet-grosoeuvre.component';
import { DecorationComponent } from './decoration/decoration.component';
import { SecuriteComponent } from './securite/securite.component';
import { DemandeComponent } from './demande/demande.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { DemandecompteComponent } from './demandecompte/demandecompte.component';
import { MesdemandesComponent } from './mesdemandes/mesdemandes.component';
import { GererdemandeComponent } from './gererdemande/gererdemande.component';
import { MatMenuModule } from '@angular/material/menu';
import { ProfilComponent } from './profil/profil.component';




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
    BsDatepickerModule.forRoot() ,
    ToastrModule.forRoot() 
    
 
  ],
 
  
  providers: [  { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },
     NotificationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
