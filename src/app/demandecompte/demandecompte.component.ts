import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Adresse } from 'src/models/Adresse';
import { Servicee } from 'src/models/Servicee';
import { Utilisateur } from 'src/models/Utilisateur';
import { UtilisateurService } from '../service/utilisateur.service';
import { AdresseService } from '../service/adresse.service';
import { FileService } from '../service/file.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthServiceService } from '../service/auth-service.service';
import { Demande } from 'src/models/Demande';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-demandecompte',
  templateUrl: './demandecompte.component.html',
  styleUrls: ['./demandecompte.component.css']
})
export class DemandecompteComponent {
  today: Date = new Date();

  adresses: Adresse[] = [];
  demandeForm!: FormGroup;
  currentMonth: Date = new Date(2025, 2, 1);
  unknownHours: boolean = false;
  selectedAdresse: any = '';
  step: number = 1;
  showResetForm = false; 
 
  selectedTimee: string = "";
  services: Servicee[] = []; 
  showModal: boolean = false;
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
  
  selectedDate: Date | null = null;

  adresseSelectionnée!: Adresse;
  email: string | null = null;
  serviceId: number | null = null;

  errorMessage: string = '';
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
private router: Router
 ) {
  
  {
    this.today = new Date();
    this.today.setHours(0, 0, 0, 0);
   
    this.demandeForm = this.fb.group({
      
      description: ['', Validators.required],
      date: ['', Validators.required],
      heureTravail: ['', Validators.required],
      idService: ['', Validators.required], 
      idAdresse: ['', Validators.required] ,
      title: ['', Validators.required],  
  telephoneNumber: ['', [Validators.required, Validators.pattern(/^[0-8]+$/)]],
 
    });

  }
  

   
  }ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.serviceId = params['idservice'];
  
     
      if (params['email']) {
        this.email = params['email'];
      } else {
        const token = localStorage.getItem('accessToken');
        if (token) {
          try {
            const decodedToken: any = jwtDecode(token);
            this.email = decodedToken.sub; 
          } catch (error) {
            console.error("Erreur lors du décodage du token :", error);
          }
        }
      }
  
      
    });
  
    this.loadAdresses();
    this.updateCalendar();
  }
  
  
  openModal() {
  
    this.showModal = true;
  }
  closeModal() {
   
    this.showModal = false;
  }submitDemande() {
    // Vérification de la validité du formulaire
    console.log("Vérification de la validité du formulaire...");
    if (this.demandeForm.invalid) {
      console.error("Formulaire invalide !");
      // Affichage des erreurs de chaque champ
      Object.keys(this.demandeForm.controls).forEach(field => {
        const control = this.demandeForm.get(field);
        if (control?.invalid) {
          console.warn(`- ${field} : Erreur :`, control.errors);
        }
      });
      return; // Sortir si le formulaire est invalide
    }
  
    // Récupération des valeurs du formulaire
    const idService = this.demandeForm.value.idService;
    const idAdresse = this.demandeForm.value.idAdresse;
    const description = this.demandeForm.value.description;
    const date = this.demandeForm.value.date;
    const heureTravail = this.demandeForm.value.heureTravail;
    const title = this.demandeForm.value.title;
    const telephoneNumber = this.demandeForm.value.telephoneNumber;
  
    console.log("Valeurs récupérées du formulaire :");
    console.log("idService:", idService);
    console.log("idAdresse:", idAdresse);
    console.log("description:", description);
    console.log("date:", date);
    console.log("heureTravail:", heureTravail);
    console.log("title:", title);
    console.log("telephoneNumber:", telephoneNumber);
  
    const emailUtilisateur = this.email;
    if (!emailUtilisateur) {
      console.error("L'email de l'utilisateur est introuvable !");
      return; // Retourner si l'email est manquant
    }
  
    // Recherche du service et de l'adresse sélectionnés
    const service = this.services.find(s => s.idservice === idService);
    const adresse = this.adresses.find(a => a.idAdresse === idAdresse);
  
    console.log("Service trouvé :", service);
    console.log("Adresse trouvée :", adresse);
  
    if (!service || !adresse) {
      console.error("Service ou adresse non trouvés !");
      return; // Sortir si le service ou l'adresse n'est pas trouvé
    }
  
    const demande: Demande = {
      description: description,
      date: date,
      heureTravail: heureTravail,
      demandephoto: this.selectedFile ? this.selectedFile.name : undefined,
      servicee: service,
      adressedemande: adresse,
      utilisateur: this.utilisateurActuel,
      title: title,
      telephoneNumber: telephoneNumber
    };
  
    console.log("Demande préparée :", demande);
  
    // Envoi de la demande via le service
    this.utilisateurservice.creerDemande(emailUtilisateur, idService, idAdresse, demande).subscribe(
      (response) => {
        console.log("Demande envoyée avec succès !");
        console.log(response); // Affichage de la réponse de l'API
      },
      (error) => {
        console.error("Erreur lors de la création de la demande", error);
      }
    );
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
      const today = new Date();
      today.setHours(0, 0, 0, 0); 
      
      if (date < today) {
        return; 
      }
    
      this.selectedDate = date;
      this.demandeForm.controls['date'].setValue(date);
    }
    
  
    
  nextStepe() {
    if (this.step < 3) {
      this.step++;
    }
  }

  previousStepe() {
    this.step = 1;
  }updateCalendar() {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
  
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const offset = firstDay === 0 ? 6 : firstDay - 1;
  
   
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
  
    this.daysInMonth = [];
    
  
    for (let i = 0; i < offset; i++) {
      this.daysInMonth.push({ day: 0, date: new Date(year, month, i - offset + 1) });
    }
  
  
    for (let i = 1; i <= daysInMonth; i++) {
      const dayDate = new Date(year, month, i);
      this.daysInMonth.push({ day: i, date: dayDate });
    }
  
    console.log('Today:', today); 
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

