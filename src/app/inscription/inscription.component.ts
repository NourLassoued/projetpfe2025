import { Component, OnInit,HostListener } from '@angular/core';
import { AuthServiceService } from '../service/auth-service.service';
import { FileService } from '../service/file.service';
import { Router } from '@angular/router';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { UserRole } from 'src/models/UserRole';
import { StatusUtilisateur } from 'src/models/StatusUtilisateur';
import { UtilisateurService } from '../service/utilisateur.service';
import { catchError, debounceTime, Observable, of, switchMap } from 'rxjs';

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
  emailExists: boolean = false;
  emailError: string | null = null; 
  email: string = '';
  notificationMessage: string | null = null;

  constructor(private authService: AuthServiceService, private fileService: FileService,private fb: FormBuilder,
    private router: Router,private utilisateurService: UtilisateurService
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
      email: ['', [Validators.required, Validators.email, Validators.pattern("^.*@gmail.com$")], [this.emailAsyncValidator()] ],
      password: ['', [Validators.required, Validators.minLength(8)]],
      telephoneNumber: ['', [Validators.required, Validators.pattern("^[0-9]{8}$")]],
   image: [''],
      role: [UserRole.PARTICULIER],
      status:[StatusUtilisateur.ATTENTE]
    
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


  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
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
        
          this.notificationMessage = "Vérifiez votre boîte email pour activer votre compte.";
        
          // Ajout d'un délai pour laisser le temps d'afficher la notification
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000); // 2 secondes avant la redirection
        },
        error => {
         
          console.error('Erreur lors de l\'inscription de l\'utilisateur :', error);
        }
      );
    }
    checkEmail() {
      this.utilisateurService.checkEmailExists(this.email).subscribe({
        next: (exists: boolean) => {
          this.emailExists = exists;  // Met à jour l'état en fonction de la réponse
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


        
       
       
     




