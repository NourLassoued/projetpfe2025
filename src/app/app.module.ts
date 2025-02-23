import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';

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
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CompteprestaitreComponent } from './compteprestaitre/compteprestaitre.component';
import { UpdateprofileprestaitreComponent } from './updateprofileprestaitre/updateprofileprestaitre.component';
import { NavbarcompteComponent } from './navbarcompte/navbarcompte.component';

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
    NavbarcompteComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FontAwesomeModule

 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
