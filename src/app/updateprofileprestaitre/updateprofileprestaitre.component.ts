import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FileService } from '../service/file.service';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { Utilisateur } from 'src/models/Utilisateur';
import { Servicee } from 'src/models/Servicee';
import { UtilisateurService } from '../service/utilisateur.service';
import {  AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventInput } from '@fullcalendar/core';
import frLocale from '@fullcalendar/core/locales/fr';
import { Disponibilite } from 'src/models/Disponibilite';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { DisponibliteService } from '../service/disponiblite.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-updateprofileprestaitre',
  templateUrl: './updateprofileprestaitre.component.html',
  styleUrls: ['./updateprofileprestaitre.component.css']
  
})
export class UpdateprofileprestaitreComponent implements OnInit{
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  isEditing: { [key: string]: boolean } = {};
editedValues: { [key: string]: string } = {}; 
userId: number | null = null;
  user: any = null;
  profileImageUrl: SafeUrl | null = null; 
  user1: Utilisateur = { servicesOfferts: [] };
  user3: any = { disponibilites: [] };
  disponibilites: EventInput[] = [];
  utilisateurId!: number;
  nouvelleDisponibilite = { jour: '', heureDebut: '', heureFin: '' };
  editionActive = false;
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
      publicId: d.id ? d.id.toString() : '', // ✅ Vérification de l'ID
      title: `Disponible ${d['heureDebut']} - ${d['heureFin']}`, // ✅ Accès avec ['clé']
      start: `${d['jour']}T${d['heureDebut']}`,
      end: `${d['jour']}T${d['heureFin']}`
    }))
  };
  
  
 

  
 

 
  constructor(private fileService: FileService, private sanitizer: DomSanitizer, private router: Router,private utilisateurService:UtilisateurService,private cdr: ChangeDetectorRef,private disponibliteService:DisponibliteService,private toastr: ToastrService) {}
  
ngOnInit(): void {
    this.loadUserData();
  

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
      console.error("⚠️ Aucun token trouvé !");
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
      console.log(" Données utilisateur récupérées :", this.user);
      if (decodedToken.disponibilites && Array.isArray(decodedToken.disponibilites)) {
        this.user.disponibilites = decodedToken.disponibilites?.map((dispo: any, index: number) => ({
          id: dispo.id ?? index, // ✅ Assigner un ID temporaire s'il est manquant
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
  }/*
  saveChanges(field: string) {
    if (!this.userId) {
      console.error("⚠️ Impossible de mettre à jour : ID utilisateur introuvable !");
      return;
    }
  
    const updatedData = { [field]: this.editedValues[field] }; // Ne met à jour que le champ modifié
  
    this.utilisateurService.updateUser(this.userId, updatedData).subscribe({
      next: (response) => {
        console.log(`✅ ${field} mis à jour avec succès :`, response);
  
        if (response.token) {
          localStorage.removeItem('accessToken'); // Supprime l'ancien token
          localStorage.setItem('accessToken', response.token); // Stocke le nouveau token
          console.log("🔄 Nouveau token enregistré !");
        }
  
        this.user[field] = updatedData[field]; // Met à jour la valeur localement
        this.isEditing[field] = false; // Désactive l'édition pour ce champ
      },
      error: (err) => {
        console.error(`❌ Erreur lors de la mise à jour de ${field} :`, err);
      }
    });
  }
  */
 saveChanges(field: string) {
  if (!this.userId) {
    console.error("⚠️ Impossible de mettre à jour : ID utilisateur introuvable !");
    return;
  }

  // 🔹 Si on met à jour une disponibilité, on appelle le bon service
  if (field === "disponibilites") {
    console.log("📌 Mise à jour des disponibilités :", this.user.disponibilites);

    this.utilisateurService.updateUser(this.userId, { disponibilites: this.user.disponibilites })
      .subscribe({
        next: (response) => {
          console.log("✅ Disponibilités mises à jour avec succès :", response);

          // 🔹 Mettre à jour les disponibilités localement
          this.user.disponibilites = response.disponibilites; // Mise à jour des nouvelles valeurs
          this.loadDisponibilites(); // Recharge FullCalendar
        },
        error: (err) => {
          console.error("❌ Erreur lors de la mise à jour des disponibilités :", err);
        }
      });

    return;
  }

  // 🔹 Mise à jour d'autres champs utilisateur
  const updatedData = { [field]: this.editedValues[field] };

  this.utilisateurService.updateUser(this.userId, updatedData)
    .subscribe({
      next: (response) => {
        console.log(`✅ ${field} mis à jour avec succès :`, response);

        if (response.token) {
          localStorage.removeItem('accessToken'); // Supprime l'ancien token
          localStorage.setItem('accessToken', response.token); // Stocke le nouveau token
          console.log("🔄 Nouveau token enregistré !");
        }

        this.user[field] = updatedData[field]; // Met à jour la valeur localement
        this.isEditing[field] = false; // Désactive l'édition pour ce champ
      },
      error: (err) => {
        console.error(`❌ Erreur lors de la mise à jour de ${field} :`, err);
      }
    });
}






  ouvrirEdition(dispo: any) {
    this.disponibiliteSelectionnee = dispo;
    this.editionActive = true;
  
    setTimeout(() => {
      if (this.calendarComponent) {
        this.calendarComponent.getApi().render();
        this.calendarComponent.getApi().refetchEvents();
      }
      this.loadDisponibilites();
      this.cdr.detectChanges();
    }, 500);
  }

  fermerEdition() {
    this.editionActive = false;
  }

  loadDisponibilites() {
    const daysOfWeek: { [key: string]: number } = {
      'Dimanche': 0, 'Lundi': 1, 'Mardi': 2, 'Mercredi': 3, 'Jeudi': 4, 'Vendredi': 5, 'Samedi': 6
    };
  
    this.calendarOptions = {
      ...this.calendarOptions,
      events: this.user.disponibilites
        .filter((dispo: any) => dispo.jour && daysOfWeek[dispo.jour] !== undefined)
        .map((dispo: any) => ({
          id: dispo.id ?? 'Non défini',
          title: `Disponible ${dispo.heureDebut} - ${dispo.heureFin}`,
          daysOfWeek: [daysOfWeek[dispo.jour]],
          startTime: dispo.heureDebut,
          endTime: dispo.heureFin,
          color: '#98FB98'
        })),
      
      // 🔹 Ajout du gestionnaire de clic sur un événement
      eventClick: (info) => this.gererClickEvent(info)
    };
  
    console.log("📌 Disponibilités mises à jour dans le calendrier :", this.calendarOptions.events);
  }gererClickEvent(info: any) {
    console.log("🔍 ID de l'événement cliqué :", info.event.id);
    console.log("📌 Liste des disponibilités :", this.user.disponibilites);
  
    const dispo = this.user.disponibilites.find((d: Disponibilite) => Number(d.id) === Number(info.event.id));
  
    if (dispo) {
      const confirmation = confirm(`Voulez-vous modifier cette disponibilité ?\n\n📅 ${dispo.jour} (${dispo.heureDebut} - ${dispo.heureFin})`);
      
      if (confirmation) {
        // 🔹 Appel de la méthode pour modifier la disponibilité
        this.disponibliteService.modifierDisponibilite(dispo.id, dispo).subscribe({
          next: (updatedDispo) => {
            alert("✅ Disponibilité mise à jour avec succès !");
            console.log("📌 Disponibilité mise à jour :", updatedDispo);
          },
          error: (err) => {
            alert("❌ Erreur lors de la mise à jour !");
            console.error("⚠️ Erreur :", err);
          }
        });
      }
    } else {
      alert("❌ Disponibilité introuvable !");
      console.error("⚠️ Aucune correspondance trouvée avec l'ID :", info.event.id);
    }
  }
  sauvegarderModification() {
    this.disponibliteService.modifierDisponibilite(this.disponibiliteSelectionnee.id, this.disponibiliteSelectionnee)
      .subscribe({
        next: (updatedDispo) => {
          alert("✅ Disponibilité mise à jour avec succès !");
          this.editionActive = false; // Fermer la modal
          this.loadDisponibilites(); // Rafraîchir le calendrier
        },
        error: (err) => {
          alert("❌ Erreur lors de la mise à jour !");
          console.error("⚠️ Erreur :", err);
        }
      });
  }
  
}  