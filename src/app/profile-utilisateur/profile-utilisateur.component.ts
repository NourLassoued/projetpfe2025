import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { FileService } from '../service/file.service';
import { SafeUrl } from '@angular/platform-browser';
import { Utilisateur } from 'src/models/Utilisateur';

import { AvisService } from '../service/avis.service';
import { fr } from 'date-fns/locale';
import { Avis } from 'src/models/Avis';

import { formatDistanceToNow } from 'date-fns';

@Component({
  selector: 'app-profile-utilisateur',
  templateUrl: './profile-utilisateur.component.html',
  styleUrls: ['./profile-utilisateur.component.css']
})
export class ProfileUtilisateurComponent implements OnInit {
  showNotification = false;
  profileImage: string | null = null;
  user: any;
  utilisateurs: Utilisateur[] = [];
  userI!: number;
  profileImageUrl: SafeUrl | null = null;
  avisAffiches: any[] = [];
  indexDebut: number = 0;
  avisParPage: number = 3;
  avisList: Avis[] = [];
  user1: Utilisateur = { servicesOfferts: [] };
  userId: number | undefined;
  constructor(private readonly fileService: FileService,

    private readonly cdr: ChangeDetectorRef,
    private readonly avisService: AvisService,
  ) { }


  ngOnInit(): void {
    this.loadAvis(this.userId!);

    this.mettreAJourAffichage();
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
      if (decodedToken.disponibilites && Array.isArray(decodedToken.disponibilites)) {
        this.user.disponibilites = decodedToken.disponibilites?.map((dispo: any, index: number) => ({
          id: dispo.id ?? index,
          jour: dispo.jour,
          heureDebut: dispo.heureDebut,
          heureFin: dispo.heureFin
        })) ?? [];


      } else {
        this.user.disponibilites = [];

      }

    }
  }
  mettreAJourAffichage() {
    this.avisAffiches = this.avisList.slice(this.indexDebut, this.indexDebut + this.avisParPage);
  }

  suivant() {
    if (this.indexDebut + this.avisParPage < this.avisList.length) {
      this.indexDebut += this.avisParPage;
      this.mettreAJourAffichage();
    }
  }

  precedent() {
    if (this.indexDebut > 0) {
      this.indexDebut -= this.avisParPage;
      this.mettreAJourAffichage();
    }

  }

  loadUserData(): void {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      console.error("Aucun token trouvé !");
      return;
    }

    try {
      const decodedToken: any = jwtDecode(token);

      if (!decodedToken.id) {
        console.error("L'ID utilisateur est introuvable dans le token !");
        return;
      }

      this.userId = decodedToken.id;
      this.user = decodedToken;
      this.loadAvis(this.userId!);



      if (this.user.image) {
        this.loadProfileImage(this.user.image);
      } else {
        console.warn("Aucune image trouvée dans le token !");
      }


      if (this.user.telephoneNumber) {
        console.log("Numéro de téléphone trouvé :", this.user.telephoneNumber);
      }


      if (decodedToken.disponibilites && Array.isArray(decodedToken.disponibilites)) {
        this.user.disponibilites = decodedToken.disponibilites.map((dispo: any, index: number) => ({
          id: dispo.id ?? index,
          jour: dispo.jour,
          heureDebut: dispo.heureDebut,
          heureFin: dispo.heureFin
        }));
      } else {
        this.user.disponibilites = [];
      }


      if (decodedToken.services && Array.isArray(decodedToken.services)) {
        this.user1.servicesOfferts = decodedToken.services.map((service: string) => ({
          idservice: null,
          nomservice: service.replace(/[\r\n]+/g, '').trim()
        }));
      } else {
        console.warn("Aucun service trouvé dans le token !");
      }


    } catch (error) {
      console.error("Erreur lors du décodage du token :", error);
    }


  }
  loadProfileImage(filename: string, index: number = 0, type: 'utilisateur' | 'user' = 'user'): void {
    this.fileService.getImage(filename).subscribe({
      next: (imageBlob) => {
        const imageUrl = URL.createObjectURL(imageBlob);

        if (type === 'utilisateur') {

          const utilisateur = this.avisList?.[index]?.utilisateur;

          if (utilisateur) {
            utilisateur.image = imageUrl;
          } else {
            console.error('Utilisateur à l\'index ' + index + ' ou utilisateur est undefined.');
          }
        } else if (type === 'user') {
          this.profileImageUrl = imageUrl;
        }
      },
      error: (error) => {
        console.error('Erreur de chargement de l\'image', error);
      }
    });
  }

  loadAvis(userId: number): void {
    this.avisService.getAvisParprestatitr(userId).subscribe({
      next: (avisdata) => {
        this.avisList = avisdata;

        this.avisList?.forEach((avis, index) => {
          if (avis.utilisateur?.image) {

            this.loadProfileImage(avis.utilisateur.image, index, 'utilisateur');
            this.mettreAJourAffichage();

            console.log(`Image de l'utilisateur à l'index ${index}:`, avis.utilisateur.image);
          } else {
            console.log(`Utilisateur à l'index ${index} est undefined ou n'a pas d'image`);
          }
        });
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des avis:', error);
      }
    });
  }



  afficherNumero() {
    this.showNotification = true;
  }

  closeNotification() {
    this.showNotification = false;
  }



  getRatingCount(star: number): number {
    return this.avisList.filter((a) => a.note === star).length;
  }

  getRatingPercentage(star: number): number {
    const total = this.avisList.length;
    if (total === 0) return 0;
    return (this.getRatingCount(star) / total) * 100;
  }

  getAverageRating(): string {
    const total = this.avisList.length;
    if (total === 0) return '0.0';
    const sum = this.avisList.reduce((acc, avis) => acc + (avis.note ?? 0), 0);
    return (sum / total).toFixed(1);
  }
  getTempsEcoule(date?: Date): string {
    if (!date) {
      return 'Date inconnue';
    }

    return formatDistanceToNow(date, { addSuffix: true, locale: fr });
  }


}