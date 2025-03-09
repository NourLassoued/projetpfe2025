import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
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
import { MatSnackBarModule } from '@angular/material/snack-bar';

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
import { MyDocsComponent } from './my-docs/my-docs.component';
import { UserComponent } from './user/user.component';




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
    MyDocsComponent,
    UserComponent,
   

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,

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
    
    BsDatepickerModule.forRoot() ,
    ToastrModule.forRoot() 
 
  ],
  providers: [NotificationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
