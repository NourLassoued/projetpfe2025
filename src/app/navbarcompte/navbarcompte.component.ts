import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FileService } from '../service/file.service';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { AuthServiceService } from '../service/auth-service.service';

import { CategorieService } from '../service/categorie.service';
import { ServiceeService } from '../service/servicee.service';
import { Servicee } from 'src/models/Servicee';

import { WebsocketServiceService } from '../service/websocket-service.service';
import { MessageService } from '../service/message.service';
import { NotificationpartuculierServiceService } from '../service/notificationpartuculier-service.service';
import { Publication } from 'src/models/Publication';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

@Component({
  selector: 'app-navbarcompte',
  templateUrl: './navbarcompte.component.html',
  styleUrls: ['./navbarcompte.component.css']
})
export class NavbarcompteComponent implements OnInit, AfterViewInit {
  entrepriseImages: { [id: number]: SafeUrl } = {};

  showMessageModal: boolean = false;
  unseenPublications: Publication[] = [];
  unreadMessages: any[] = [];
  messages: string[] = [];
  selectedServiceId!: number;
  displayedCategories: any[] = [];
  currentIndex: number = 0;
  demandesDisponibles: any[] = [];
  totalCategories: number = 0;
  categories: any[] = [];
  imageUrls: string[] = [];
  notificationMessage: string = '';
  services: any[] = [];
  selectedCategory: any = null;
  allCategories: any[] = [];
  Categories: any[] = [];
  bellAnimated = false;
  filteredCategories: any[] = [];
  private notificationsSubscription: any;

  itemsPerPage = 4;
  notifications: string[] = [];
  isConnected: boolean = false;
  newMessage: boolean = false;
  newFilteredCategories: any[] = []
  searchQuery: string = '';
  filteredServices: Servicee[] = [];
  searchQueryservice: string = '';
  showModal = false;
  showServiceModal = false;
  selectedServices: any[] = [];
  notification: string | null = null;
  showNotification: boolean = false;
  isMenuOpen: boolean = true;
  user: any = null;
  profileImageUrl: SafeUrl | null = null;
  userRole: string | null = null;

  unreadCount: number = 0;
  newMessageCount: number = 0;


  constructor(private readonly fileService: FileService,
    private  readonly sanitizer: DomSanitizer,
    private readonly authServiceService: AuthServiceService,
    private readonly categorieService: CategorieService, private  readonly file: FileService,
    private readonly  service: ServiceeService,
    private readonly router: Router,
    private readonly websocketService: WebsocketServiceService,
    private readonly cdr: ChangeDetectorRef,
    private readonly messageservice: MessageService,
    private readonly notificationserviceparticulier: NotificationpartuculierServiceService

  ) { }
  ngOnDestroy(): void {

    if (this.notificationsSubscription) {
      this.notificationsSubscription.unsubscribe();
    }
  }

  ngAfterViewInit(): void {
    const user = this.authServiceService.getCurrentUser();
    this.user = user;
    this.isConnected = !!user;


    this.toggleMenu();
    this.cdr.detectChanges();

  }

  ngOnInit(): void {
    this.bellAnimated = true;

    setTimeout(() => this.bellAnimated = false, 1000);
    setTimeout(() => {
      const user = this.authServiceService.getCurrentUser();
      this.user = user;
      this.isConnected = !!user;







    });
    this.loadUserData();
    this.loadNotifications();
    if (this.user) {

      this.messageservice.getUndeliveredMessages(this.user.id).subscribe({
        next: (messages) => {
          this.newMessageCount = messages.length;
          this.newMessage = true;
        },
        error: (err) => {
          console.error("Erreur récupération des messages non délivrés :", err);
        }
      });
    }
    this.websocketService.getMessages().subscribe((message) => {
      this.newMessageCount++;
      this.newMessage = true;
    })



    this.userRole = this.authServiceService.getUserRole();

    this.user = this.authServiceService.getCurrentUser();

    if (this.userRole === 'PRESTATAIRE') {
      this.websocketService.connect(this.user.idUtilisateur, this.userRole);
      this.notificationsSubscription = this.websocketService.getNotifications().subscribe((message: string) => {

        if (message && !this.notifications.includes(message)) {
          this.notifications.unshift(message);
          this.unreadCount++;

        }
      });
    }




    this.cdr.detectChanges();

    this.getAllCategories();
    this.redirectBasedOnRole();


    this.fileService.profileImage$.subscribe((newImageUrl) => {
      if (newImageUrl) {
        this.profileImageUrl = this.sanitizer.bypassSecurityTrustUrl(newImageUrl);

      }
    });

  }
  loadEntrepriseImages() {
    for (let pub of this.unseenPublications) {
      const entreprise = pub.entreprise;
      if (entreprise?.idUtilisateur && entreprise.image) {
        this.fileService.getImage(entreprise.image).subscribe({
          next: (imageBlob) => {
            const objectURL = URL.createObjectURL(imageBlob);
            this.entrepriseImages[entreprise.idUtilisateur!] = this.sanitizer.bypassSecurityTrustUrl(objectURL);
          },
          error: (err) => {
            console.error('Erreur chargement image entreprise', err);
          }
        });
      }
    }
  }
  
  loadNotifications() {
    this.notificationserviceparticulier.getUnseenPublications(this.user.id).subscribe(publications => {
      this.unseenPublications = publications;
      this.unreadCount = this.unseenPublications.length;
      this.loadEntrepriseImages();

    });
  }


  goToConsulterEntreprise(publication: Publication) {
    const entrepriseId = publication.entreprise?.idUtilisateur;

    const publicationId = publication.id;
    this.loadUserData();

    const userId = this.user.id;

    if (!entrepriseId || !publicationId || !userId) {
      console.error("Informations manquantes !");
      return;
    }

  
    this.notificationserviceparticulier.markPublicationAsSeen(userId, publicationId).subscribe({
      next: () => {
        this.router.navigate(['/ConsulterEntreprise', entrepriseId]);
      },
      error: (error) => {
        console.error("Erreur lors du marquage de la publication comme lue :", error);
      }
    });
  }







  goToComptePrestataireAvecMessage(message: string): void {
    if (this.router.url.startsWith('/Compteprestaitre')) {

      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/Compteprestaitre'], {
          queryParams: { notif: message }
        });
      });
    } else {

      this.router.navigate(['/Compteprestaitre'], {
        queryParams: { notif: message }
      });
    }
  }



  resetNewMessageCount() {
    this.newMessageCount = 0;
  }



  toggleNotification() {
    this.showNotification = !this.showNotification;

    if (this.showNotification) {

      this.unreadCount = 0;
    }
    this.bellAnimated = true;

  setTimeout(() => this.bellAnimated = false, 1000);
}
  


  redirectBasedOnRole(): void {
    if (this.userRole === 'prestataire' || this.userRole === 'entreprise') {
      this.router.navigate(['/Compteprestaitre']);
    }
  }

  getImage(filename: string, index: number) {
    this.file.getImage(filename).subscribe({
      next: (imageBlob) => {
        const imageUrl = URL.createObjectURL(imageBlob);
        this.imageUrls[index] = imageUrl;
      },
      error: (error) => {
        // handle error if needed
      }
    });
  }

  loadUserData(): void {
    const token = localStorage.getItem('accessToken');

    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        this.user = decodedToken;

        if (this.user?.id) {
          // L'utilisateur a un ID, aucune action supplémentaire requise ici.
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

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }


  showSkillModal() {

    this.getAllCategories();

    this.showModal = true;
  }


  closeServiceModal() {
    this.showServiceModal = false;
    this.showModal = false

  }


  getAllCategories() {
    this.categorieService.getAllCategories().subscribe({
      next: (data) => {
        this.filteredCategories = data;

        if (this.filteredCategories.length === 0) {
          console.warn('Aucune catégorie trouvée');
        }
        this.filteredCategories.forEach((category, index) => {
          this.getImage(category.imageCategorie, index);
        });
      },
      error: (error) => {
        console.error('Erreur lors du chargement des catégories', error);
      }
    });
  }
  onSearch(): void {


    if (this.searchQuery.trim() === '') {
      this.getAllCategories();
    } else {
      this.categorieService.searchCategories(this.searchQuery).subscribe({
        next: (data) => {
          this.filteredCategories = data;
        },
        error: (error) => {
          console.error('Erreur lors de la recherche des catégories', error);
        }
      });
    }
  }
  filterServices() {
    if (this.searchQuery.trim() === '') {

      this.filteredServices = this.services;
    } else {

      this.filteredServices = this.services.filter(service =>
        service.nomservice?.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  }


  selectCategory(categoryName: string) {
    this.selectedCategory = this.filteredCategories.find(category => category.nom === categoryName) ?? null;

    if (this.selectedCategory) {


      this.getAllServicesByCategorie(this.selectedCategory.id);
      this.showServiceModal = true;
    } else {
      console.error('Catégorie non trouvée');
    }
  }
  getAllServicesByCategorie(categorieId: number) {
    this.service.getAllServicesByCategorie(categorieId).subscribe({
      next: (services: Servicee[]) => {
        this.services = services;
        this.services.forEach((service, index) => {
          this.getImage(service.imageService, index);
        });
        this.filterServices();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des services:', error);

      }
    });
  }


  selectService(service: any) {
    this.selectedServiceId = service.idservice;

    const token = localStorage.getItem('accessToken');
    let userEmail = '';

    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        userEmail = decodedToken.sub;

      } catch (error) {
        console.error("Erreur lors du décodage du token :", error);
      }
    }

    if (!this.selectedServiceId) {
      console.error("ID du service est indéfini !");
      return;
    }

    this.router.navigate(['/Demandeservice'], {
      queryParams: { idservice: this.selectedServiceId, email: userEmail }
    });
  }

  logout(): void {

    localStorage.removeItem('accessToken')
    this.router.navigate(['/Front']);
  }

  getRelativeTime(dateString: string | Date): string {
    return 'il y a ' + formatDistanceToNow(new Date(dateString), { addSuffix: false, locale: fr });
  }

}




