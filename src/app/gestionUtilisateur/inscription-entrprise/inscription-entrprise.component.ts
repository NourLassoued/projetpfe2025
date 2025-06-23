import { Component } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { CategorieService } from '../../service/categorie.service';
import { FileService } from '../../service/file.service';
import { ServiceeService } from '../../service/servicee.service';
import { AuthServiceService } from '../../service/auth-service.service';
import { UserRole } from 'src/models/UserRole';
import { Servicee } from 'src/models/Servicee';
import { StatusUtilisateur } from 'src/models/StatusUtilisateur';
import { UtilisateurService } from '../../service/utilisateur.service';
import { catchError, debounceTime, Observable, of, switchMap, firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inscription-entrprise',
  templateUrl: './inscription-entrprise.component.html',
  styleUrls: ['./inscription-entrprise.component.css']
})
export class InscriptionEntrpriseComponent {
  form1: FormGroup;

  notificationMessage: string | null = null;
  step = 1;
  categories: any[] = [];
  showModal = false;
  imageUrls: string[] = [];
  showServiceModal = false;
  selectedCategory: any = null;
  services: any[] = [];
  selectedFiles: { [key: string]: File } = {};
  selectedServices: any[] = [];
  showForm1: boolean = true;  
  showForm2: boolean = false; 
  emailExists: boolean = false;
  emailError: string | null = null; 
  email: string = '';

  constructor(
    private  readonly fb: FormBuilder,
   
    private readonly  categorieService: CategorieService,
    private readonly  file: FileService,
    private  readonly service: ServiceeService,
    private  readonly authService: AuthServiceService,
    private readonly utilisateurService: UtilisateurService,
    private readonly router: Router
  ) {
 
    this.form1 = this.fb.group({
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.pattern("^.*@gmail.com$")], [this.emailAsyncValidator()] ],
      password: ['', [Validators.required, Validators.minLength(8)]],
      telephoneNumber: ['', [Validators.required, Validators.pattern("^[0-9]{8,15}$")]], 

      competence: [[]],
      nomEntreprise: ['', Validators.required],
      siret: ['', [Validators.required, Validators.pattern("^[0-9]{14}$")]],
      siteWeb: [''],
      image: [''],
      role: [UserRole.ENTREPRISE],
       status:[StatusUtilisateur.ATTENTE]

    });
  }
  nextStep() {
    if (this.form1.valid) {
      this.step = 2;
    }
  }

  previousStep() {
    this.step = 1;
  }
   
  closeServiceModal() {
    this.showServiceModal = false;
    this.showModal = false
  
  }

  showSkillModal() {
    
    this.getAllCategories();
    this.showModal = true;
  }

  getAllCategories() {
    this.categorieService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data;
       
        this.categories.forEach((category, index) => {
          this.getImage(category.imageCategorie, index);
        });
      },
      error: (error) => {
        console.error('Erreur lors du chargement des catégories', error);
      }
    });
  }

  getImage(filename: string, index: number) {
    this.file.getImage(filename).subscribe({
      next: (imageBlob) => {
        const imageUrl = URL.createObjectURL(imageBlob);
        this.imageUrls[index] = imageUrl;
      },
      error: (error) => {
        console.error('Erreur lors du chargement de l\'image', error);
      }
    });
  }

  selectCategory(categoryName: string) {
    this.selectedCategory = this.categories.find(category => category.nom === categoryName) ?? null;

    if (this.selectedCategory) {
      console.log('Categorie ID:', this.selectedCategory.id);
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
      },
      error: (error) => {
        console.error('Erreur lors du chargement des services:', error);
        alert('Une erreur est survenue lors du chargement des services.');
      }
    });
  }

  selectService(service: any) {
    if (this.selectedServices.includes(service)) {
      this.selectedServices = this.selectedServices.filter(s => s !== service);
    } else {
      this.selectedServices.push(service);
    }

   
    this.form1.controls['competence'].setValue(this.selectedServices.map(s => s.nomservice));
  }

  onFileSelected(event: any, fileType: string): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFiles[fileType] = file;
    }
  }

  onSubmit(): void {
    if (this.form1.valid) {
      const formData = { ...this.form1.value };

      const fileUploadPromises = Object.keys(this.selectedFiles).map((fileType) =>
        firstValueFrom(this.file.uploadFile(this.selectedFiles[fileType]))
      );

      Promise.all(fileUploadPromises)
        .then((responses: any[]) => {
          responses.forEach((response, index) => {
            const fileType = Object.keys(this.selectedFiles)[index];
            const filename = response.split(': ')[1];
            formData[fileType] = filename;
          });

          this.authService.register(formData).subscribe({
            next: (response: any) => {
              this.notificationMessage = "Vérifiez votre email pour avoir plus d'informations de votre candidature.";
              this.form1.reset();
              setTimeout(() => {
                this.router.navigate(['/login']);
              }, 2000); 
            },
            error: (error) => {
              console.error("Erreur lors de l'inscription :", error);
              alert("Une erreur s'est produite lors de l'inscription.");
            }
          });
        })
        .catch((error) => {
          console.error("Erreur lors de l'upload des fichiers :", error);
          alert("Une erreur s'est produite lors de l'upload des fichiers.");
        });
    } else {
      alert("Veuillez remplir tous les champs correctement.");
    }
  }
checkEmail() {
  this.utilisateurService.checkEmailExists(this.email).subscribe({
    next: (exists: boolean) => {
      this.emailExists = exists;  
      if (this.emailExists) {
        this.emailError = "L'email existe déjà ! Veuillez en choisir un autre.";
      } else {
        this.emailError = null;
      }
    },
    error: (err) => {
      console.error('Erreur lors de la vérification de l\'email', err);
    }
  });
}
emailAsyncValidator(): AsyncValidatorFn {
     return (control: AbstractControl): Observable<ValidationErrors | null> => {
       if (!control.value) {
         return of(null);
       }
       return this.utilisateurService.checkEmailExists(control.value).pipe(
         debounceTime(300),
         switchMap((exists: boolean) => (exists ? of({ emailExists: true }) : of(null))),
         catchError(() => of(null))
       );
     };
   }
 
}