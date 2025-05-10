import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { Avis } from 'src/models/Avis';
import { Utilisateur } from 'src/models/Utilisateur';
import { FileService } from '../service/file.service';
import { AvisService } from '../service/avis.service';
import { jwtDecode } from 'jwt-decode';
import { formatDistanceToNow } from 'date-fns';
import { fr, th } from 'date-fns/locale';
import { ActivatedRoute } from '@angular/router';
import { UserRole } from 'src/models/UserRole';
import { UtilisateurService } from '../service/utilisateur.service';

import { MessageService } from '../service/message.service';
import { ToastrService } from 'ngx-toastr';
import { PublicationService } from '../service/publication.service';
import { Publication } from 'src/models/Publication';
import { Commentaire } from 'src/models/Commentaire';
import { CommentaireService } from '../service/commentaire.service';
import { co } from '@fullcalendar/core/internal-common';


@Component({
  selector: 'app-consulterentrprise',
  templateUrl: './consulterentrprise.component.html',
  styleUrls: ['./consulterentrprise.component.css']
})
export class ConsulterentrpriseComponent implements OnInit {
  likes: { [publicationId: number]: number } = {};
  nombreDeLikesParPublication: { [key: number]: number } = {};
  utilisateurADejaLikeParPublication: { [key: number]: boolean } = {};

  showNotification = false;
  profileImage: string | null = null;
  user: any = {};
  commentImages: { [commentId: number]: string } = {};

  publicationId!: number;

  nombreDeLikes: number = 0;
  utilisateurADejaLike: boolean = false;

  publicationsAffichees: any[] = [];
  nombreAffiche: number = 3;
  selecteduser: any = null;
  profileImageUrl: SafeUrl | null = null;
  avis: Avis = {
    note: 0,
    commentaire: ''
  };
  commentaireVisible: { [key: number]: boolean } = {};
  nouveauxCommentaires: { [key: number]: string } = {};
  commentaires: Commentaire[] = [];

  user1: Utilisateur = { servicesOfferts: [] };
  score: number = 0;
  showModal = false;
  utilisateurConnecteId!: number;
  userId: number | undefined;
  prestataireId!: number;
  commentaireVisiblee: { [publicationId: number]: boolean } = {};
  intervalId: any;
  likedPublications: number[] = [];

  commentairesParPublication: { [key: number]: Commentaire[] } = {};

  utilisateurId!: number;
  demandeId!: number;
  avisAffiches: any[] = [];
  indexDebut: number = 0;
  avisParPage: number = 3;
  avisList: Avis[] = [];
  userRole: string = '';
  contenuMessage: string = '';
  utilisateurConnecte: any;
  publications: Publication[] = [];

  constructor(private fileService: FileService,

    private activatedRoute: ActivatedRoute,
    private utilisateurservice: UtilisateurService,
    private publicationService: PublicationService,
    private cdr: ChangeDetectorRef,
    private avisService: AvisService,
    private toastr: ToastrService,
    private commentaireService: CommentaireService,
    private messageService: MessageService,) { }

  ngOnInit(): void {


    this.cdr.detectChanges();

    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.prestataireId = +id;


        this.loadAvis(this.prestataireId);
        this.loadPublications();

      } else {
        console.error("ID du prestataire manquant dans les paramètres de l'URL !");
      }
    });



    this.activatedRoute.paramMap.subscribe(params => {
      const userIdParam = params.get('id');
      if (userIdParam) {
        this.userId = +userIdParam;
        this.utilisateurservice.getById(this.userId).subscribe(
          (userData: any) => {
            this.user = userData;
            if (this.user?.image) {
              this.loadProfileImage(this.user.image);
            }


            if (userData.services && Array.isArray(userData.services)) {
              this.user.servicesOfferts = userData.services.map((service: string) => ({
                idservice: null,
                nomservice: service.replace(/[\r\n]+/g, '').trim()
              }));
            } else {
              this.user.servicesOfferts = [];
            }


          },
          (error) => {
            console.error("Erreur lors de la récupération de l'utilisateur :", error);
          }
        );
      }
    });
    this.publicationService.getAllPublications().subscribe((publications) => {
      this.publications = publications;

      this.publications.forEach((pub) => {
        if (pub.id !== undefined) {
          this.chargerCommentaires(pub.id);
        }
      });
    });

    this.intervalId = setInterval(() => {
      this.chargerPublicationsEtCommentaires();
    }, 6000);

  }
  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
  chargerPublicationsEtCommentaires(): void {
    this.publicationService.getAllPublications().subscribe((publications) => {
      this.publications = publications;

      this.publications.forEach((pub) => {
        if (pub.id !== undefined) {
          this.chargerCommentaires(pub.id);
          this.getLikes(pub.id);
          this.verifierSiDejaLike(pub.id);



        }
      });
    });
  }

  toggleLike(publicationId: number): void {
    const token = localStorage.getItem('accessToken');

    if (token) {
      const decodedToken: any = jwtDecode(token);
      this.utilisateurConnecteId = decodedToken.id;
    }

    this.publicationService.toggleLike(publicationId, this.utilisateurConnecteId).subscribe({
      next: () => {
        this.getLikes(publicationId);



      },
      error: (err) => console.error('Erreur lors de l\'ajout/retrait du like', err)
    });
  }



  getLikes(publicationId: number): void {
    this.publicationService.getNombreDeLikes(publicationId).subscribe({
      next: (likes: number) => {
        this.nombreDeLikesParPublication[publicationId] = likes;

      },
      error: (err) => console.error('Erreur lors de la récupération du nombre de likes', err)
    });
  }
  verifierSiDejaLike(publicationId: number): void {
    const token = localStorage.getItem('accessToken');

    if (token) {
      const decodedToken: any = jwtDecode(token);
      this.utilisateurConnecteId = decodedToken.id;

      this.publicationService.utilisateurADejaLike(publicationId, this.utilisateurConnecteId)
        .subscribe({
          next: (aLike: boolean) => {
            this.utilisateurADejaLikeParPublication[publicationId] = aLike;
          },
          error: (err) => console.error('Erreur lors de la vérification du like', err)
        });
    }
  }

  loadPublications(): void {
    if (!this.prestataireId) {
      console.error("userId est manquant !");
      return;
    }

    this.publicationService.getPublicationsParEntreprise(this.prestataireId).subscribe(
      (data) => {
        this.publications = data;
        this.mettreAJourAffichagePublication()
      },
      (error) => {
        console.error('Erreur lors de la récupération des publications :', error);
      }
    );
  }
  mettreAJourAffichagePublication(): void {
    this.publicationsAffichees = this.publications.slice(0, this.nombreAffiche);
  }

  voirPlus(): void {
    this.nombreAffiche += 3;
    this.mettreAJourAffichagePublication();
  }

  envoyerCommentaire(publicationId: number, utilisateurConnecteId: number) {
    const token = localStorage.getItem('accessToken');

    if (token) {

      const decodedToken: any = jwtDecode(token);
      this.utilisateurConnecteId = decodedToken.id;
    }
    const idAvisUtilisateur = this.utilisateurConnecteId;

    const contenu = this.nouveauxCommentaires[publicationId];

    if (contenu && contenu.trim() !== '') {
      const commentaire: Commentaire = {
        contenu: contenu.trim(),
        dateCommentaire: new Date(),
      };

      this.commentaireService.ajouterCommentaire(publicationId, idAvisUtilisateur, commentaire).subscribe({
        next: (response) => {

          this.nouveauxCommentaires[publicationId] = '';

        },
        error: (err) => {
          console.error('Erreur lors de l\'ajout du commentaire :', err);
        }
      });
    }
  }


  getAverageRating(): number {
    return this.score;
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







  afficherNumero() {
    this.showNotification = true;
  }

  closeNotification() {
    this.showNotification = false;
  }

  loadProfileImage(filename: string, index: number = 0, type: 'utilisateur' | 'user' | 'commentaire' = 'user'): void {
    this.fileService.getImage(filename).subscribe(
      (imageBlob) => {
        const imageUrl = URL.createObjectURL(imageBlob);

        if (type === 'utilisateur') {
          const utilisateur = this.avisList?.[index]?.utilisateur;
          if (utilisateur) {
            utilisateur.image = imageUrl;
          } else {
          }

        } else if (type === 'commentaire') {
          for (const publicationId in this.commentairesParPublication) {
            const commentaires = this.commentairesParPublication[publicationId];
            if (commentaires && commentaires[index]) {
              const commentaire = commentaires[index];
              if (commentaire?.particulier) {
                commentaire.particulier.image = imageUrl;
              }
            }
          }

        } else if (type === 'user') {
          this.profileImageUrl = imageUrl;
        }
      },
      (error) => {
      }
    );
  }

  loadAvis(prestataireId: number): void {

    if (!prestataireId) {
      console.error("ID du prestataire manquant !");
      return;
    }
    this.avisService.getAvisParprestatitr(prestataireId).subscribe(
      (avisdata) => {
        this.avisList = avisdata;

        this.avisList?.forEach((avis, index) => {

          if (avis.utilisateur?.image) {
            this.loadProfileImage(avis.utilisateur.image, index, 'utilisateur');
            this.mettreAJourAffichage();

          } else {

          }
        });
        this.avisService.getScoreMoyen(this.prestataireId).subscribe(
          (score: number) => {
            this.score = score;

          },
          (error: any) => {
            console.error("Erreur lors de la récupération du score :", error);
          }
        );

        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Erreur lors de la récupération des avis:', error);
      }
    );
  }


  getRatingCount(star: number): number {
    return this.avisList.filter((a) => a.note === star).length;
  }

  getRatingPercentage(star: number): number {
    const total = this.avisList.length;
    if (total === 0) return 0;
    return (this.getRatingCount(star) / total) * 100;
  }

  getTempsEcoule(date?: Date): string {
    if (!date) {
      return 'Date inconnue';
    }

    return formatDistanceToNow(date, { addSuffix: true, locale: fr });
  }


  envoyerMessage(): void {

    if (!this.contenuMessage || !this.contenuMessage.trim()) {
      this.toastr.error("Veuillez entrer un message avant de l'envoyer.", "Erreur");
      return;
    }


    const token = localStorage.getItem('accessToken');

    if (token) {

      const decodedToken: any = jwtDecode(token);
      this.utilisateurConnecteId = decodedToken.id;
      this.userRole = decodedToken.role;



      if (!this.utilisateurConnecteId) {
        this.toastr.error("ID utilisateur non valide dans le token", "Erreur");
        return;
      }

      const sender = new Utilisateur();
      sender.idUtilisateur = this.utilisateurConnecteId;
      sender.role = this.userRole as UserRole;


      const receiver = new Utilisateur();
      receiver.idUtilisateur = this.prestataireId;
      receiver.role = UserRole.ENTREPRISE;

      const message = {
        sender: sender,
        receiver: receiver,
        content: this.contenuMessage,
        timestamp: new Date(),
        delivered: false,
      };


      this.messageService.sendMessage(message).subscribe({
        next: () => {
          this.toastr.success("Message envoyé avec succès !", "Succès");
          this.contenuMessage = '';
          this.showNotification = false;
        },
        error: (error) => {
          console.error("Erreur lors de l'envoi du message:", error);
          this.toastr.error("Échec de l'envoi du message !", "Erreur");
        },
      });
    } else {
      console.error("Aucun token trouvé dans localStorage !");
      this.toastr.error("Token d'authentification manquant", "Erreur");
    }
  }
  ouvrirModal(user: any): void {
    this.selecteduser = user;
    this.avis = {
      note: 0,
      commentaire: ''
    };
    this.showModal = true;



  }
  closeModal(): void {
    this.showModal = false;
  }
  envoyerAvis(): void {
    const idUtilisateur = this.userId;
    const token = localStorage.getItem('accessToken');

    if (token) {

      const decodedToken: any = jwtDecode(token);
      this.utilisateurConnecteId = decodedToken.id;
    }
    const idAvisUtilisateur = this.utilisateurConnecteId;



    this.avis.dateAvis = new Date();



    if (
      idUtilisateur == null ||
      idAvisUtilisateur == null ||
      this.avis.note == null ||
      this.avis.note < 1 || this.avis.note > 5 ||
      !this.avis.commentaire || this.avis.commentaire.trim() === ''
    ) {



      this.toastr.warning("Tous les champs sont requis et la note doit être entre 1 et 5 !");
      return;
    }


    this.utilisateurservice.donnerAvis(idAvisUtilisateur, idUtilisateur, this.avis)
      .subscribe({
        next: (response) => {
          this.toastr.success('Avis envoyé avec succès !');







          this.showModal = false;
        },
        error: (error) => {
          this.toastr.error("Erreur lors de l'envoi de l'avis !");
          console.error(error);
        }
      });
  }
  setNote(note: number): void {
    this.avis.note = note;
  }
  chargerCommentaires(publicationId: number): void {
    this.commentaireService.getCommentairesParPublication(publicationId).subscribe({
      next: (commentaires) => {
        this.commentairesParPublication[publicationId] = commentaires;

        commentaires.forEach((commentaire, index) => {
          if (commentaire.particulier?.image) {

            this.loadProfileImage(commentaire.particulier.image, index, 'commentaire');
          }
        });
      },
      error: (err) => {
        console.error(`Erreur lors du chargement des commentaires pour la publication ${publicationId}`, err);
      }
    });
  }

  toggleCommentaire(publicationId: number): void {
    this.commentaireVisible[publicationId] = !this.commentaireVisible[publicationId];

    if (this.commentaireVisible[publicationId]) {
      this.chargerCommentaires(publicationId);
    }
  }  
  supprimerCommentaire(commentaireId: number): void {
    this.commentaireService.supprimerCommentaire(commentaireId).subscribe({
      next: () => {
        console.log('Commentaire supprimé');
        this.chargerPublicationsEtCommentaires(); // recharge les commentaires
      },
      error: (err) => console.error('Erreur lors de la suppression du commentaire', err)
    });
  }
  
  loadUserData(): void {
    const token = localStorage.getItem('accessToken');

    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        this.user = decodedToken;

        if (this.user && this.user.id) {

        } else {
          console.warn('L\'ID de l\'utilisateur est introuvable dans le token');
        }

        if (this.user.image) {

          this.loadProfileImage(this.user.image);
        } else {
          console.warn(" Aucune image trouvée dans le token !");
        }
      } catch (error) {
        console.error(' Erreur lors du décodage du token:', error);
      }
    } else {
      console.warn(" Aucun token trouvé dans localStorage !");
    }
  }
  getRelativeTime(dateString: string | Date): string {
    return 'il y a ' + formatDistanceToNow(new Date(dateString), { addSuffix: false, locale: fr });
  }
}




