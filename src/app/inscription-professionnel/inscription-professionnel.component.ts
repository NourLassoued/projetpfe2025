import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceeService } from '../service/servicee.service';
import { CategorieService } from '../service/categorie.service';
import { FileService } from '../service/file.service';
import { Servicee } from 'src/models/Servicee';
import { UserRole } from 'src/models/UserRole';
import { AuthServiceService } from '../service/auth-service.service';

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
  constructor(private fb: FormBuilder,private http:HttpClient,private categorieService:CategorieService,private file:FileService,private service:ServiceeService,private authService: AuthServiceService,) {
    this.form1 = this.fb.group({
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.pattern("^.*@gmail.com$")]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      telephoneNumber: ['', [Validators.required, Validators.pattern("^[0-9]{8,15}$")]], 
     
      role: [UserRole.PRESTATAIRE],
     
      competence: [[]], 
      workExperience: [null, [Validators.required, Validators.min(0)]],  
      image: [''],
      doucument_cv:[''],
      doucument_CIN:[''],
    
    
    });

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
        // Charger les images après avoir récupéré les catégories
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
    // Vérifie que l'id de la catégorie est valide
    console.log('Categorie ID:', this.selectedCategory.id);
    this.getAllServicesByCategorie(this.selectedCategory.id); // Vérifie si 'id' est bien défini
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
      alert('Une erreur est survenue lors du chargement des services.'); // Ajout d'un message d'alerte pour informer l'utilisateur
    }
  );
}
selectService(service: any) {
  if (this.selectedServices.includes(service)) {
    this.selectedServices = this.selectedServices.filter(s => s !== service);
  } else {
    this.selectedServices.push(service);
  }

  console.log("Compétences sélectionnées : ", this.selectedServices); // Vérifier dans la console

  // Mise à jour du champ 'competence' avec la liste des services sélectionnés
  this.form1.controls['competence'].setValue(this.selectedServices.map(s => s.nomservice));
}


onFileSelected(event: any, fileType: string): void {
  const file = event.target.files[0];
  if (file) {
    this.selectedFiles[fileType] = file; // Associe le fichier au type correspondant
  }
}

onSubmit(): void {
  if (this.form1.valid ) {
    const formData = {
      ...this.form1.value,
    
    };
  
    // Liste des fichiers à uploader
    const fileUploadPromises = Object.keys(this.selectedFiles).map((fileType) =>
      this.file.uploadFile(this.selectedFiles[fileType]).toPromise()
    );

    // Upload des fichiers
    Promise.all(fileUploadPromises)
      .then((responses: any[]) => {
        responses.forEach((response, index) => {
          const fileType = Object.keys(this.selectedFiles)[index];
          const filename = response.split(': ')[1]; // Ajuste en fonction du format de réponse
          formData[fileType] = filename; // Associe le nom du fichier à formData
        });

        // Envoie des données avec les noms de fichiers
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