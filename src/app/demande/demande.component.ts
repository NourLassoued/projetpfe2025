import { Component, ViewChild, AfterViewInit, Renderer2 } from '@angular/core';
import { MatCalendar } from '@angular/material/datepicker';
import { Moment } from 'moment';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { Location } from '@angular/common';

import { Adresse } from 'src/models/Adresse';
import { Utilisateur } from 'src/models/Utilisateur';
import { Servicee } from 'src/models/Servicee';
import { UtilisateurService } from '../service/utilisateur.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AdresseService } from '../service/adresse.service';
import { FileService } from '../service/file.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Demande } from 'src/models/Demande';
import { AuthServiceService } from '../service/auth-service.service';
import { jwtDecode } from 'jwt-decode';
@Component({
  selector: 'app-demande',
  templateUrl: './demande.component.html',
  styleUrls: ['./demande.component.css'],
 
})
export class DemandeComponent  {

  adresses: Adresse[] = [];
  demandeForm!: FormGroup;
  currentMonth: Date = new Date(2025, 2, 1);
  unknownHours: boolean = false;
  selectedAdresse: any = '';
  step: number = 1;
  selectedTimee: string = "";
  services: Servicee[] = []; 

  utilisateurs: Utilisateur[] = []; 
  weekDays: string[] = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  hours: string[] = [
    "07:00", "07:30", "08:00", "08:30", "09:00", "09:30",
    "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
    "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30", "18:00", "18:30",
    "19:00", "19:30", "20:00", "20:30", "21:00"
  ];
  daysInMonth: { day: number, date: Date }[] = [];
  showPasswordInput: boolean = false;
  selectedDate!: Date;
  adresseSelectionnée!: Adresse;
  serviceSelectionné!: Servicee;
  utilisateurActuel!: Utilisateur;
  isterForm: FormGroup | undefined;
   selectedFile: File | null = null;
   selectedTime: number = 4;  
  constructor(private fb: FormBuilder, 
    private utilisateurservice:UtilisateurService,
  private adresse:AdresseService,
private file:FileService,
private route: ActivatedRoute,
private authService: AuthServiceService,
private router: Router, private location: Location, ) {
  {
   
    this.demandeForm = this.fb.group({
      emailUtilisateur: ['', [Validators.required, Validators.email]],
      description: ['', Validators.required],
      date: ['', Validators.required],
      heureTravail: ['', Validators.required],
      idService: ['', Validators.required], 
      idAdresse: ['', Validators.required] ,
      title: ['', Validators.required],  
  telephoneNumber: ['', [Validators.required, Validators.pattern(/^[0-8]+$/)]],
  password: ['', [Validators.required, Validators.minLength(6)]], 
    });
  }

    this.updateCalendar();
  }
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const idService = params['idservice'];  
      if (idService) {
        
        this.serviceSelectionné = { idservice: idService, nomservice: '' }; 
       
        this.demandeForm.patchValue({
          idService: idService
        });
      }
    });
  
    this.loadAdresses();
 
    
  }

  submitDemande() {
    if (this.demandeForm.invalid) {
     
      return;
    }

    const emailUtilisateur = this.demandeForm.value.emailUtilisateur;
    const idService = this.demandeForm.value.idService;
    const idAdresse = this.demandeForm.value.idAdresse;
    const description = this.demandeForm.value.description;
    const password = this.demandeForm.value.password; 
    const date = this.demandeForm.value.date;
    const heureTravail = this.demandeForm.value.heureTravail;
    const title = this.demandeForm.value.title;  
    const telephoneNumber = this.demandeForm.value.telephoneNumber


    const utilisateur = this.utilisateurs.find(u => u.email === emailUtilisateur);

 
    const service = this.services.find(s => s.idservice === idService);
    const adresse = this.adresses.find(a => a.idAdresse === idAdresse);
    this.authService.authenticate(emailUtilisateur, password).subscribe(
      (authResponse) => {
          const decodedToken: any = jwtDecode(authResponse.access_token);
   
    const demande: Demande = {
      description: description,
      date: date,
      heureTravail: heureTravail,
      demandephoto: this.selectedFile ? this.selectedFile.name : undefined,
      servicee: service, 
      adressedemande: adresse,  
      utilisateur: utilisateur  ,
      title: title,  // Ajouter le titre à l'objet Demande
      telephoneNumber: telephoneNumber  // Ajouter le numéro de téléphone à l'objet Demande

    };

    
    this.utilisateurservice.creerDemande(emailUtilisateur, idService, idAdresse, demande).subscribe(
      (response) => {
        console.log('Demande créée avec succès', response);
        if (decodedToken.role === 'PARTICULIER') {
          // Si le rôle est 'PARTICULIER', naviguez vers /Compteparticulier
          this.router.navigate(['/Compteparticulier']);
        }
      },
      (error) => {
        console.error('Erreur lors de la création de la demande', error);
        alert('Une erreur est survenue lors de la création de la demande.');
      }
    );
  })
  }



  selectTime(hour: number) {
    if (!this.unknownHours) {
    
      this.demandeForm.controls['heureTravail'].setValue(hour);
      this.selectedTime = hour;  
    }
  }
  selectTimee(hour: string) {
    this.selectedTimee = hour;
  

    if (this.selectedDate) {
      const selectedDateTime = new Date(this.selectedDate);
      const [hourValue, minuteValue] = hour.split(":").map(val => parseInt(val));  
      selectedDateTime.setHours(hourValue, minuteValue);  
      this.selectedDate = selectedDateTime;
  
  
      this.demandeForm.patchValue({ date: selectedDateTime });
    }
  }
  
  adjustHeure(action: 'increase' | 'decrease') {
    let currentValue = this.demandeForm.controls['heureTravail'].value;

    if (action === 'increase') {
      currentValue += 1;
    } else if (action === 'decrease' && currentValue > 1) {
      currentValue -= 1;
    }

    this.demandeForm.controls['heureTravail'].setValue(currentValue); 
  }
  toggleUnknownHours() {
    if (this.unknownHours) {

      this.demandeForm.controls['heureTravail'].disable();
      this.demandeForm.controls['heureTravail'].setValue(null);  
    } else {

      this.demandeForm.controls['heureTravail'].enable();
      this.demandeForm.controls['heureTravail'].setValue(4); 
    }
  }
  onFileSelected(event: any, type?: string) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
     
    }
  }
  

  selectDate(date: Date): void {
    this.selectedDate = date;
   
    this.demandeForm.controls['date'].setValue(date);
  }
  nextStepe() {
    if (this.step < 4) {
      this.step++;
    }
  }

  previousStepe() {
    this.step = 1;
  }
  
  updateCalendar() {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    
 
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    
    const firstDay = new Date(year, month, 1).getDay();
    const offset = firstDay === 0 ? 6 : firstDay - 1; 

  
    this.daysInMonth = [];
    for (let i = 0; i < offset; i++) {
      this.daysInMonth.push({ day: 0, date: new Date(year, month, i - offset + 1) }); // Jours vides
    }
    for (let i = 1; i <= daysInMonth; i++) {
      this.daysInMonth.push({ day: i, date: new Date(year, month, i) });
    }
  }

  prevMonth() {
    this.currentMonth.setMonth(this.currentMonth.getMonth() - 1);
    this.currentMonth = new Date(this.currentMonth);
    this.updateCalendar();
  }

  nextMonth() {
    this.currentMonth.setMonth(this.currentMonth.getMonth() + 1);
    this.currentMonth = new Date(this.currentMonth);
    this.updateCalendar();
  }

  showCalendar: boolean = false;
 

  nextStep() {
    this.showCalendar = true;
  }

  previousStep() {
   
    this.showCalendar = false;
  }


  loadAdresses(): void {
    this.adresse.getAllAdresses().subscribe((data: Adresse[]) => {
      this.adresses = data;
    });
  }
}
