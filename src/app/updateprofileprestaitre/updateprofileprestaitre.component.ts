import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FileService } from '../service/file.service';
import { jwtDecode } from 'jwt-decode';
import { Utilisateur } from 'src/models/Utilisateur';
import { UtilisateurService } from '../service/utilisateur.service';
import { ChangeDetectorRef } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventInput } from '@fullcalendar/core';
import frLocale from '@fullcalendar/core/locales/fr';
import { Disponibilite } from 'src/models/Disponibilite';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { DisponibliteService } from '../service/disponiblite.service';
import { ForgetPasswordService } from '../service/forget-password.service';
import { AdresseService } from '../service/adresse.service';
import { Adresse } from 'src/models/Adresse';


@Component({
  selector: 'app-updateprofileprestaitre',
  templateUrl: './updateprofileprestaitre.component.html',
  styleUrls: ['./updateprofileprestaitre.component.css']

})
export class UpdateprofileprestaitreComponent implements OnInit, AfterViewInit {
  @ViewChild('calendarComponent') calendarComponent!: FullCalendarComponent;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;


  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }
  calendarApi: any;

  ngAfterViewInit() {
    if (this.calendarComponent) {
      this.calendarApi = this.calendarComponent.getApi();
    } else {
      console.error(" FullCalendar non trouvé !");
    }
  }



  passwordData = {
    oldPassword: '',
    password: '',
    repeatPassword: ''
  };
  selectedAdresse: any;

  passwordError = '';
  selectedFile: File | null = null;
  isEditing: { [key: string]: boolean } = {};
  editedValues: { [key: string]: string } = {};
  userId: number | null = null;
  user: any = null;
  adresses: Adresse[] = [];
  profileImageUrl: SafeUrl | null = null;
  user1: Utilisateur = { servicesOfferts: [] };
  user3: any = { disponibilites: [] };
  disponibilites: EventInput[] = [];
  utilisateurId!: number;
  nouvelleDisponibilite: any = {
    jour: '',
    heureDebut: '',
    heureFin: ''
  }

  erreurs: { general?: string; jour?: string; heureDebut?: string; heureFin?: string } = {};

  soumis: boolean = false;
  selectedFiles: { [key: string]: File } = {};
  imageUrls: string[] = [];
  editionActive = false;
  isAddingNewDisponibilite: boolean = false;
  calendarVisible: boolean = false;
  modificationMode = false;
  ajoutMode = false;
  disponibiliteSelectionnee: any = null;
  calendarOptions: CalendarOptions = {
    initialView: 'timeGridWeek',
    locales: [frLocale],
    locale: 'fr',
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    editable: true,

    events: this.disponibilites.map(d => ({
      id: d.id ? d.id.toString() : '',
      publicId: d.id ? d.id.toString() : '',
      title: `Disponible ${d['heureDebut']} - ${d['heureFin']}`,
      start: `${d['jour']}T${d['heureDebut']}`,
      end: `${d['jour']}T${d['heureFin']}`

    }))
  };


  constructor(private readonly fileService: FileService, private readonly sanitizer: DomSanitizer, private readonly utilisateurService: UtilisateurService, private readonly cdr: ChangeDetectorRef,
    private readonly disponibliteService: DisponibliteService,
    private readonly cdRef: ChangeDetectorRef,
    private readonly forgetPasswordService: ForgetPasswordService,
    private readonly uploadService: FileService, private readonly adreesse: AdresseService,
    private readonly renderer: Renderer2) { }

  ngOnInit(): void {

    this.loadAdresses();
    this.loadUserData();

    this.loadDisponibilites();

    this.fileService.profileImage$.subscribe((newImageUrl) => {
      if (newImageUrl) {
        this.profileImageUrl = this.sanitizer.bypassSecurityTrustUrl(newImageUrl);

      }
    });

    this.nouvelleDisponibilite = { jour: '', heureDebut: '', heureFin: '' };
    this.erreurs = {};

    const token = localStorage.getItem('accessToken');

    if (token) {
      const decodedToken: any = jwtDecode(token);


      if (decodedToken.services && Array.isArray(decodedToken.services)) {
        this.user1.servicesOfferts = decodedToken.services.map((service: string) => ({
          idservice: null,
          nomservice: service.replace(/[\r\n]+/g, '').trim()
        }));

      } else {
        console.warn(" Aucun service trouvé dans le token !");
      }
    }
  }


  loadAdresses(): void {
    this.adreesse.getAllAdresses().subscribe((data) => {
      this.adresses = data;
    });
  }

  loadProfileImage(filename: string): void {
    this.fileService.getImage(filename).subscribe({
      next: (imageBlob) => {
        const objectURL = URL.createObjectURL(imageBlob);
        this.profileImageUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      },
      error: (err) => {
        console.error(' Erreur de chargement de l\'image', err);
        this.profileImageUrl = null;
      }
    });
  }


  loadUserData(): void {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      console.error(" Aucun token trouvé !");
      return;
    }

    try {
      const decodedToken: any = jwtDecode(token);

      if (!decodedToken.id) {
        console.error(" L'ID utilisateur est introuvable dans le token !");
        return;
      }

      this.user = decodedToken;
      this.userId = decodedToken.id;

      if (decodedToken.disponibilites && Array.isArray(decodedToken.disponibilites)) {
        this.user.disponibilites = decodedToken.disponibilites?.map((dispo: any, index: number) => ({
          id: dispo.id ?? index,
          jour: dispo.jour,
          heureDebut: dispo.heureDebut,
          heureFin: dispo.heureFin
        })) || [];


      } else {
        this.user.disponibilites = [];


        this.loadDisponibilites();
      }

      if (this.user.image) {
        this.loadProfileImage(this.user.image);
      } else {
        console.warn(" Aucune image trouvée dans le token !");
      }

    } catch (error) {
      console.error("Erreur lors du décodage du token :", error);
    }
  }





  startEditing(field: string, currentValue: string) {
    this.isEditing[field] = true;
    this.editedValues[field] = currentValue;
  }



  saveChanges(field: string) {
    if (!this.userId) {
      console.error(" Impossible de mettre à jour : ID utilisateur introuvable !");
      return;
    }
    if (field === "profileImage" && this.selectedFile) {
      this.updateProfileImage();

      return;
    }

    if (field === "password") {
      const newPassword = this.editedValues['password'];
      const confirmPassword = this.editedValues['confirmPassword'];

      if (!newPassword || !confirmPassword) {
        this.passwordError = "Veuillez remplir tous les champs.";
        return;
      }

      if (newPassword.length < 6) {
        this.passwordError = "Le mot de passe doit contenir au moins 6 caractères.";
        return;
      }

      if (newPassword !== confirmPassword) {
        this.passwordError = "Les mots de passe ne correspondent pas.";
        return;
      }


      this.forgetPasswordService.changePassword(this.userId, this.editedValues['password'], this.editedValues['confirmPassword'])
        .subscribe({
          next: (response) => {

            this.isEditing[field] = false;
            this.passwordError = "";
          },
          error: (err) => {
            console.error("Erreur lors du changement de mot de passe :", err);
            this.passwordError = err.error || "Une erreur est survenue.";
          }
        });

      return;
    }

    if (field === "disponibilites") {


      this.utilisateurService.updateUser(this.userId, { disponibilites: this.user.disponibilites })
        .subscribe({
          next: (response) => {



            this.user.disponibilites = response.disponibilites;
            this.loadDisponibilites();
          },
          error: (err) => {
            console.error("Erreur lors de la mise à jour des disponibilités :", err);
          }
        });

      return;

    }
    if (field === "adresse") {
      if (!this.selectedAdresse) {
        console.error("Aucune adresse sélectionnée !");
        return;
      }


      let adresseObjet = typeof this.selectedAdresse === 'string'
        ? this.adresses.find(a => a.governoate === this.selectedAdresse)
        : this.selectedAdresse;

      if (!adresseObjet || !adresseObjet.idAdresse) {
        console.error(" Adresse introuvable !");
        return;
      }

      this.utilisateurService.affecterAdresse(this.userId, adresseObjet.idAdresse)
        .subscribe({
          next: (response) => {


            if (response.token) {
              localStorage.removeItem('accessToken');
              localStorage.setItem('accessToken', response.token);

            }
            this.user.adresse = adresseObjet;
            this.isEditing[field] = false;


          },
          error: (err) => {
            console.error(" Erreur lors de la mise à jour de l'adresse :", err);
          }
        });
    }


    const updatedData = { [field]: this.editedValues[field] };

    this.utilisateurService.updateUser(this.userId, updatedData)
      .subscribe({
        next: (response) => {


          if (response.token) {
            localStorage.removeItem('accessToken');
            localStorage.setItem('accessToken', response.token);

          }


          this.user[field] = updatedData[field];
          this.isEditing[field] = false;
        },
        error: (err) => {
          console.error(`Erreur lors de la mise à jour de ${field} :`, err);
        }
      });
  }

  loadDisponibilites() {
    const daysOfWeek: { [key: string]: number } = {
      'Dimanche': 0, 'Lundi': 1, 'Mardi': 2, 'Mercredi': 3, 'Jeudi': 4, 'Vendredi': 5, 'Samedi': 6
    };

    this.calendarOptions = {
      ...this.calendarOptions,
      initialDate: new Date().toISOString().split("T")[0],
      events: this.user?.disponibilites?.map((dispo: any) => ({
        id: dispo.id?.toString() ?? '',
        title: `Disponible ${dispo.heureDebut} - ${dispo.heureFin}`,
        daysOfWeek: [daysOfWeek[dispo.jour]],
        startTime: dispo.heureDebut,
        endTime: dispo.heureFin,
        color: '#98FB98',
        extendedProps: { dispo }
      })) || [],
      eventContent: function (arg: any) {
        const editIcon = document.createElement("span");
        editIcon.innerHTML = " ✏️";
        editIcon.style.cursor = "pointer";
        editIcon.style.marginLeft = "1px";
        editIcon.onclick = () => {

        };

        const titleElement = document.createElement("span");
        titleElement.innerText = arg.event.title;

        const container = document.createElement("div");
        container.appendChild(titleElement);
        container.appendChild(editIcon);

        return { domNodes: [container] };
      },

      eventClick: this.onEventClick.bind(this)
    };



  }


  ouvrirEdition(dispo?: any) {
    this.editionActive = true;
    this.disponibiliteSelectionnee = dispo ? { ...dispo } : null;
  }

  fermerEdition() {
    this.editionActive = false;
    this.disponibiliteSelectionnee = null;
  }

  updateDisponibilite() {
    if (!this.disponibiliteSelectionnee || !this.disponibiliteSelectionnee.id) {

      return;
    }



    this.disponibliteService.modifierDisponibilite(this.disponibiliteSelectionnee.id, this.disponibiliteSelectionnee)
      .subscribe({
        next: (response: any) => {

          if (response.token) {
            localStorage.removeItem('accessToken');
            localStorage.setItem('accessToken', response.token);

          }

          this.editionActive = false;
          const index = this.user.disponibilites.findIndex((d: any) => d.id === this.disponibiliteSelectionnee.id);

          if (index !== -1) {
            this.user.disponibilites[index] = { ...this.disponibiliteSelectionnee };
          }

          this.loadDisponibilites();
          this.refreshCalendar();

        },
        error: (err) => {

        }
      });


  }


  refreshCalendar() {
    setTimeout(() => {
      const calendarApi = this.calendarComponent.getApi();
      calendarApi.removeAllEvents();
      if (Array.isArray(this.calendarOptions.events)) {
        this.calendarOptions.events.forEach((event: any) => calendarApi.addEvent(event));
      }
    }, 300);
  }

  toggleCalendarView() {
    this.loadDisponibilites();
    this.calendarVisible = !this.calendarVisible;
  }
   onEventClick(info: any) {
    const eventId = info.event.id;
    const dispo = this.user?.disponibilites?.find((d: any) => d.id.toString() === eventId);

    if (dispo) {
      this.ouvrirEdition(dispo);
    }
  }

  afficherFormulaireAjout() {
    this.ajoutMode = true;
    this.editionActive = false;
    this.nouvelleDisponibilite = { jour: '', heureDebut: '', heureFin: '' };
    this.erreurs = {};
  }


  afficherFormulaireModification(dispo: Disponibilite) {
    this.editionActive = true;
    this.ajoutMode = true;
    this.disponibiliteSelectionnee = { ...dispo };
  }
  ajouterDisponibilite(nouvelleDispo: any) {

    if (!nouvelleDispo) {
      console.warn("ℹ Initialisation de nouvelleDisponibilite...");
      nouvelleDispo = { jour: '', heureDebut: '', heureFin: '' };
    }
    if (!this.nouvelleDisponibilite) {
      this.nouvelleDisponibilite = { jour: '', heureDebut: '', heureFin: '' };
    }




    this.erreurs = {};


    if (!nouvelleDispo.jour) {
      this.erreurs.jour = "⚠️ Veuillez sélectionner un jour.";
    }
    if (!nouvelleDispo.heureDebut) {
      this.erreurs.heureDebut = "⚠️ Veuillez entrer une heure de début.";
    }
    if (!nouvelleDispo.heureFin) {
      this.erreurs.heureFin = "⚠️ Veuillez entrer une heure de fin.";
    }
    if (nouvelleDispo.heureDebut >= nouvelleDispo.heureFin) {
      this.erreurs.general = "❌ L'heure de début doit être avant l'heure de fin.";
    }

    if (Object.keys(this.erreurs).length > 0) {

      return;
    }


    if (this.verifierChevauchement(nouvelleDispo)) {
      this.erreurs.general = "❌ Une autre disponibilité existe déjà sur cet horaire !";
      return;
    }
    this.cdRef.detectChanges();

    this.disponibliteService.ajouterDisponibilite(this.user.id, nouvelleDispo)
      .subscribe((response: any) => {
        if (!response || !response.disponibilite) {
          this.erreurs.general = "❌ Erreur : Réponse invalide du serveur !";
          this.cdRef.detectChanges();
          return;
        }

        const dispoAjoutee = response.disponibilite;
        this.user.disponibilites.push(dispoAjoutee);

        if (response.token) {
          localStorage.removeItem('accessToken');
          localStorage.setItem('accessToken', response.token);
        }


        this.nouvelleDisponibilite = {};
        this.erreurs.general = "";
        this.editionActive = false;
        this.ajoutMode = false;
        setTimeout(() => {
          this.cdRef.detectChanges();
          this.loadDisponibilites();
          this.refreshCalendar();
        }, 100);

      }, (error) => {
        this.erreurs.general = "❌ Erreur lors de l'ajout : " + error.message;
        console.error("🚨 Erreur API :", error);
        this.cdRef.detectChanges();
      });
  }
  verifierChevauchement(nouvelleDispo: any): boolean {
    const chevauchement = this.user.disponibilites.some((dispo: any) => {
      const chevauche = (
        dispo.jour === nouvelleDispo.jour &&
        (
          (nouvelleDispo.heureDebut >= dispo.heureDebut && nouvelleDispo.heureDebut < dispo.heureFin) ||
          (nouvelleDispo.heureFin > dispo.heureDebut && nouvelleDispo.heureFin <= dispo.heureFin) ||
          (nouvelleDispo.heureDebut <= dispo.heureDebut && nouvelleDispo.heureFin >= dispo.heureFin)
        )
      );

      if (chevauche) {
        console.log(" Chevauchement détecté avec :", dispo);
      }

      return chevauche;
    });

    return chevauchement;
  }






  fermerFormulaire() {
    this.editionActive = false;
    this.ajoutMode = false;
    this.modificationMode = false;
  }
  supprimerDisponibilite(disponibiliteId: number): void {


    this.disponibliteService.supprimerDisponibilite(disponibiliteId).subscribe({
      next: (response) => {


        this.user.disponibilites = this.user.disponibilites.filter((dispo: Disponibilite) => dispo.id !== disponibiliteId);

        if (response.token) {
          localStorage.removeItem('accessToken');
          localStorage.setItem('accessToken', response.token);

        }

        this.loadDisponibilites();
        this.refreshCalendar();
      },
      error: (err) => {
        console.error("Erreur lors de la suppression :", err);
      }
    });
  }


  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.updateProfileImage();
    }
  }

  getImage(filename: string, index: number) {
    this.fileService.getImage(filename).subscribe(
      (imageBlob) => {
        const imageUrl = URL.createObjectURL(imageBlob);
        this.imageUrls[index] = imageUrl;

      },
      (error) => {
        console.error('Erreur lors du chargement de l\'image', error);
      }
    );
  } updateProfileImage() {
    if (!this.userId) {
      console.error("Impossible de mettre à jour : ID utilisateur introuvable !");
      return;
    }

    if (!this.selectedFile) {
      console.error("Aucun fichier sélectionné !");
      return;
    }

    this.uploadService.uploadFile(this.selectedFile).subscribe({
      next: (response: any) => {
        const filename = response.split(': ')[1];
        if (!filename) {
          console.error("Réponse d'upload invalide :", response);
          return;
        }

        const updatedImageUrl = `http://localhost:8088/nour/api/v1/auth/get-image/${filename}?t=${new Date().getTime()}`;
        this.profileImageUrl = updatedImageUrl;

        this.cdr.detectChanges();

        setTimeout(() => {
          const imgElement = document.getElementById('profile-icon') as HTMLImageElement;
          if (imgElement) {
            this.renderer.setAttribute(imgElement, 'src', updatedImageUrl);
          }
        }, 100);

        this.utilisateurService.updateUser(Number(this.userId), { image: filename }).subscribe({
          next: (updateResponse) => {
            this.isEditing['profileImage'] = false;
            this.fileService.updateProfileImage(updatedImageUrl);

            if (updateResponse.token) {
              localStorage.removeItem('accessToken');


            }
            localStorage.setItem('accessToken', updateResponse.token);

            this.loadUserData();
          },
          error: (err) => {
            console.error("Erreur lors de la mise à jour du profil :", err);
          }
        });
      },
      error: (err) => {
        console.error("Erreur lors de l'upload :", err);
      }
    });
  }
}