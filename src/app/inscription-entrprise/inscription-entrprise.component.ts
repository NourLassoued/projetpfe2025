import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategorieService } from '../service/categorie.service';
import { FileService } from '../service/file.service';
import { ServiceeService } from '../service/servicee.service';
import { AuthServiceService } from '../service/auth-service.service';
import { UserRole } from 'src/models/UserRole';
import { Servicee } from 'src/models/Servicee';
import { StatusUtilisateur } from 'src/models/StatusUtilisateur';

@Component({
  selector: 'app-inscription-entrprise',
  templateUrl: './inscription-entrprise.component.html',
  styleUrls: ['./inscription-entrprise.component.css']
})
export class InscriptionEntrpriseComponent {
  form1: FormGroup;

  step = 1;
  categories: any[] = [];
  showModal = false;
  imageUrls: string[] = [];
  showServiceModal = false;
  selectedCategory: any = null;
  services: any[] = [];
  selectedFiles: { [key: string]: File } = {};
  selectedServices: any[] = [];
  showForm1: boolean = true;  // Set to true or false based on your logic
  showForm2: boolean = false; // Set to true or false based on your logic


  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private categorieService: CategorieService,
    private file: FileService,
    private service: ServiceeService,
    private authService: AuthServiceService
  ) {
    // Initialisation de form1
    this.form1 = this.fb.group({
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.pattern("^.*@gmail.com$")]],
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
   


  showSkillModal() {
    console.log("Ouverture de la modale...");
    this.getAllCategories();
    this.showModal = true;
  }

  getAllCategories() {
    this.categorieService.getAllCategories().subscribe(
      (data) => {
        this.categories = data;
        console.log('Catégories chargées:', this.categories);
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
        console.log(`Image chargée pour la catégorie ${filename}`);
      },
      (error) => {
        console.error('Erreur lors du chargement de l\'image', error);
      }
    );
  }

  selectCategory(categoryName: string) {
    this.selectedCategory = this.categories.find(category => category.nom === categoryName) || null;

    if (this.selectedCategory) {
      console.log('Categorie ID:', this.selectedCategory.id);
      this.getAllServicesByCategorie(this.selectedCategory.id);
      this.showServiceModal = true;
    } else {
      console.error('Catégorie non trouvée');
    }
  }

  getAllServicesByCategorie(categorieId: number) {
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

    console.log("Compétences sélectionnées : ", this.selectedServices);
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
              console.log("Réponse d'inscription :", response);
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
}