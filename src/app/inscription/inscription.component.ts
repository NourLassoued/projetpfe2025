import { Component, OnInit,HostListener } from '@angular/core';
import { AuthServiceService } from '../service/auth-service.service';
import { FileService } from '../service/file.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserRole } from 'src/models/UserRole';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css']
})
export class InscriptionComponent  implements OnInit{
  registerForm!: FormGroup;
  modalPosition = { top: '50%', left: '50%' }; 
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null; // Prévisualisation de l'image
  showModal: boolean = false;
  

  constructor(private authService: AuthServiceService, private fileService: FileService,private fb: FormBuilder,
    private router: Router,
  ) {}

 

  openModal() {
    console.log("✅ Modal ouverte !");
    this.showModal = true;
  }

  closeModal() {
    console.log("❌ Modal fermée !");
    this.showModal = false;
  }
  ngOnInit(): void {
    this.registerForm = this.fb.group({
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.pattern("^.*@gmail.com$")]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      telephoneNumber: ['', [Validators.required, Validators.pattern("^[0-9]{8,15}$")]], // Numéro entre 8 et 15 chiffres
   image: [''],
      role: [UserRole.PARTICULIER],
    
    });
  }
 

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
    }
  }


 
    onSubmit(): void {
      if (this.registerForm.valid) {
        if (this.selectedFile) {
          this.fileService.uploadFile(this.selectedFile).subscribe(
            (response: any) => {
              const filename = response.split(': ')[1];
              console.log(filename);
              this.registerForm.patchValue({ image: filename });
              this.register();
            },
            error => {
              console.error('Error uploading file:', error);
              // Handle error uploading file (e.g., show error message)
            }
          );
        } else {
          this.register();
        }
      } else {
        console.error('Invalid form');
       
      }
    }

    register(): void {
      // Vérifie si le formulaire est valide avant d'envoyer les données
      if (this.registerForm.invalid) {
        console.log('Formulaire invalide');
        return;
      }
    
      // Crée un objet avec les valeurs du formulaire
      const formData = { ...this.registerForm.value };
    
      // Appelle la méthode de service pour l'inscription
      this.authService.register(formData).subscribe(
        (response: any) => {
          // Réinitialise le formulaire en cas d'inscription réussie
          this.registerForm.reset();
          console.log("Réponse : ", response);
    
          // Redirige l'utilisateur vers la page de connexion
          this.router.navigate(['/login']);
        },
        error => {
          // Affiche l'erreur dans la console en cas d'échec de l'inscription
          console.error('Erreur lors de l\'inscription de l\'utilisateur :', error);
        }
      );
    }
  }    


        
       
       
     




