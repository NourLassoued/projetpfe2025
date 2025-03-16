import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormArray, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ServiceeService } from '../service/servicee.service';
import { CategorieService } from '../service/categorie.service';
import { FileService } from '../service/file.service';
import { Servicee } from 'src/models/Servicee';
import { UserRole } from 'src/models/UserRole';
import { AuthServiceService } from '../service/auth-service.service';
import { StatusUtilisateur } from 'src/models/StatusUtilisateur';
import { catchError, debounceTime, Observable, of, switchMap } from 'rxjs';
import { UtilisateurService } from '../service/utilisateur.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inscription-professionnel',
  templateUrl: './inscription-professionnel.component.html',
  styleUrls: ['./inscription-professionnel.component.css']
})
export class InscriptionProfessionnelComponent {
  step = 1;
  form1: FormGroup;
  

  categories: any[] = [];
  showModal = false;
  imageUrls: string[] = [];
  showServiceModal = false; 
  selectedFile!: File;
  selectedCategory: any = null;  
  services: any[] = [];   
  selectedFiles: { [key: string]: File } = {};     
  selectedServices: any[] = [];
  emailExists: boolean = false;
  emailError: string | null = null; 
  email: string = '';
  notificationMessage: string = ''; 
  constructor(private fb: FormBuilder,private http:HttpClient,private categorieService:CategorieService,private file:FileService,private service:ServiceeService,private authService: AuthServiceService,private utilisateurService:UtilisateurService, private router: Router) {
    this.form1 = this.fb.group({
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.pattern("^.*@gmail.com$")], [this.emailAsyncValidator()] ],
      password: ['', [Validators.required, Validators.minLength(8)]],
      telephoneNumber: ['', [Validators.required, Validators.pattern("^[0-9]{8,15}$")]], 
     
      role: [UserRole.PRESTATAIRE],
       status:[StatusUtilisateur.ATTENTE],
     
      competence: [[]], 
      workExperience: [null, [Validators.required, Validators.min(0)]],  
      image: [''],
      doucument_cv:[''],
      doucument_CIN:[''],
    
    
    });
    

  }


  showNotification(message: string): void {
    this.notificationMessage = message;  
    setTimeout(() => {
      this.notificationMessage = '';  
    }, 3000);  
  }

  closeNotification(): void {
    this.notificationMessage = '';  
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
 

  showSkillModal() {
    
    this.getAllCategories();

    this.showModal = true;
  } 
   getAllCategories() {
    this.categorieService.getAllCategories().subscribe(
      (data) => {
        this.categories = data;
       
        this.categories.forEach((category, index) => {
          this.getImage(category.imageCategorie, index);
        });
      },
      (error) => {
        console.error('Erreur lors du chargement des catégories', error);
      }
    );
  }

  
  getImage(filename: string, index: number) {
    this.file.getImage(filename).subscribe(
      (imageBlob) => {
        const imageUrl = URL.createObjectURL(imageBlob);
        this.imageUrls[index] = imageUrl;
       
      },
      (error) => {
        console.error('Erreur lors du chargement de l\'image', error);
      }
    );
  }

selectCategory(categoryName: string) {
  this.selectedCategory = this.categories.find(category => category.nom === categoryName) || null;

  if (this.selectedCategory) {
   
  
    this.getAllServicesByCategorie(this.selectedCategory.id); 
    this.showServiceModal = true;
  } else {
    console.error('Catégorie non trouvée');
  }
}getAllServicesByCategorie(categorieId: number) {
  this.service.getAllServicesByCategorie(categorieId).subscribe(
    (services: Servicee[]) => {
      this.services = services;
      this.services.forEach((service, index) => {
        this.getImage(service.imageService, index);
      });
    },
    (error) => {
      console.error('Erreur lors du chargement des services:', error);
      alert('Une erreur est survenue lors du chargement des services.'); 
    }
  );
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
  if (this.form1.valid ) {
    const formData = {
      ...this.form1.value,
    
    };
  
  
    const fileUploadPromises = Object.keys(this.selectedFiles).map((fileType) =>
      this.file.uploadFile(this.selectedFiles[fileType]).toPromise()
    );

   
    Promise.all(fileUploadPromises)
      .then((responses: any[]) => {
        responses.forEach((response, index) => {
          const fileType = Object.keys(this.selectedFiles)[index];
          const filename = response.split(': ')[1]; 
          formData[fileType] = filename; 
        });

      
        this.authService.register(formData).subscribe(
          (response: any) => {
         
            this.notificationMessage = "Vérifiez votre email pour avoir plus d'informations de votre candidature.";
            this.form1.reset();
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 2000); 
         
           
          },
          (error) => {
            console.error("Erreur lors de l'inscription :", error);
            alert("Une erreur s'est produite lors de l'inscription.");
          }
        );
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


}    


    
   
   
 





