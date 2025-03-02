import { Component, OnInit,HostListener } from '@angular/core';
import { AuthServiceService } from '../service/auth-service.service';
import { FileService } from '../service/file.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserRole } from 'src/models/UserRole';
import { StatusUtilisateur } from 'src/models/StatusUtilisateur';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css']
})
export class InscriptionComponent  implements OnInit{
  registerForm!: FormGroup;
  modalPosition = { top: '50%', left: '50%' }; 
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null; 
  showModal: boolean = false;
  

  constructor(private authService: AuthServiceService, private fileService: FileService,private fb: FormBuilder,
    private router: Router,
  ) {}

 

  openModal() {
 
    this.showModal = true;
  }

  closeModal() {
   
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
      status:[StatusUtilisateur.ATTENTE]
    
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
     
      if (this.registerForm.invalid) {
        console.log('Formulaire invalide');
        return;
      }
    
    
      const formData = { ...this.registerForm.value };
    
     
      this.authService.register(formData).subscribe(
        (response: any) => {
     
          this.registerForm.reset();
          console.log("Réponse : ", response);
    
         
          this.router.navigate(['/login']);
        },
        error => {
         
          console.error('Erreur lors de l\'inscription de l\'utilisateur :', error);
        }
      );
    }
  }    


        
       
       
     




