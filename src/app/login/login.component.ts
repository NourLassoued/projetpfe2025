import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthServiceService } from '../service/auth-service.service';
import { Router } from '@angular/router';
import { StatusUtilisateur } from 'src/models/StatusUtilisateur';
import { ForgetPasswordService } from '../service/forget-password.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  
  public loginForm!: FormGroup;
  showLoginForm = true; // Affiche le formulaire de connexion par défaut
  email: string = '';
  password: string = '';
  showResetForm = false; 
  resetPasswordForm: FormGroup;
  showResetPassword = false; 
  showModal: boolean = false;
  isAdmin: boolean = false; 
  profileImage: string | undefined;
  showConfirmation = false;
  errorMessage: string = '';
  modalPosition = { top: '50%', left: '50%' }; 
  constructor(private fb: FormBuilder, private authService: AuthServiceService, private router: Router,private forgetPasswordService:ForgetPasswordService) {
    this.loginForm = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  });
  this.resetPasswordForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });}

  openModal() {
    console.log("✅ Modal ouverte !");
    this.showModal = true;
  }

  closeModal() {
    console.log("❌ Modal fermée !");
    this.showModal = false;
  }
  resetPassword() {
    if (this.resetPasswordForm.valid) {
      console.log("🔑 Email envoyé à:", this.resetPasswordForm.value.email);
      alert("Un e-mail de réinitialisation a été envoyé !");
      this.closeModal();
    }
  }verifyAndSendEmail() {
    if (this.resetPasswordForm.invalid) {
      this.errorMessage = 'Veuillez entrer une adresse e-mail valide.';
      return;
    }
  
    const email = this.resetPasswordForm.value.email;
  
    this.forgetPasswordService.verifyEmail(email).subscribe({
      next: (response) => {
        console.log('✅ Email trouvé, envoi en cours...');
        
        // 🔹 Navigation vers "/Front" après la vérification réussie
        this.router.navigate(['/new']);
      },
      error: (err) => {
        console.error('❌ Erreur :', err);
        this.errorMessage = "Cet email n'existe pas dans notre base de données.";
      }
    });
  }
  
/*
 authenticate(): void {
    this.authService.authenticate(this.loginForm.value.email, this.loginForm.value.password).subscribe(

      response => {
        console.log('Réponse de l\'authentification dans le composant :', response);
  
        // Vérifie si la réponse contient un statut valide
        if (response && response.status && Object.values(StatusUtilisateur).includes(response.status)) {
          
          if (response.status === StatusUtilisateur.ACCEPTE) {
            console.log('Utilisateur accepté, accès autorisé.');
  
            // Stocker l'utilisateur en local
            localStorage.setItem('currentUser', JSON.stringify(response));
  
            // Rediriger vers la page d'accueil
            this.navigateToHome();
          } else {
            console.warn('Utilisateur non accepté, accès refusé.');
            // Ajouter ici une gestion d'erreur (ex: afficher un message à l'utilisateur)
          }
          
        } else {
          console.error('La réponse d\'authentification est invalide ou ne contient pas le statut.');
        }
      },
      error => {
        console.error('Erreur lors de l\'authentification :', error);
        // Gérer les erreurs d'authentification ici
      }
    );
  }
  

navigateToHome() {
  // Naviguer vers la page d'accueil
  this.router.navigate(['/Front']);
}

  refreshToken(refreshToken: string): void {
    this.authService.refreshToken(refreshToken).subscribe(
      response => {
        // Traitez la réponse du rafraîchissement de token ici
        console.log('Token refreshed', response);
      },
      error => {
        // Gérer les erreurs de rafraîchissement de token ici
        console.error('Refresh token error', error);
      }
    );
  }*/authenticate(): void {
    this.authService.authenticate(this.loginForm.value.email, this.loginForm.value.password).subscribe(
      response => {
          if (response && response.access_token) {
            localStorage.setItem("accessToken", response.access_token);

           
              const decodedToken: any = jwtDecode(response.access_token);
              
          

          
              if (decodedToken.role === 'PRESTATAIRE') {
                  this.router.navigate(['/Compteprestaitre']);
              } else {
                  this.router.navigate(['/Front']);
              }
          } else {
              console.error('❌ La réponse ne contient pas de token valide.');
          }
      },
      error => {
          console.error('🚨 Erreur lors de l\'authentification :', error);
      }
  );
}
    
  getImageUrl(filename: string): string {
    return `http://localhost:8087/nour/api/v1/auth/get-image/${filename}`;
  }}

