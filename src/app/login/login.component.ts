import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthServiceService } from '../service/auth-service.service';
import { Router } from '@angular/router';

import { ForgetPasswordService } from '../service/forget-password.service';
import { jwtDecode } from 'jwt-decode';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  public loginForm!: FormGroup;
  showLoginForm = true;
  notificationMessage: string | null = null;
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
  constructor(private readonly fb: FormBuilder,
    private  readonly authService: AuthServiceService,
    private readonly router: Router,
    private readonly  toastr: ToastrService,
    private readonly forgetPasswordService: ForgetPasswordService,
    private  readonly cdr: ChangeDetectorRef) {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.resetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  openModal() {

    this.showModal = true;
  }

  closeModal() {

    this.showModal = false;
  }
  resetPassword() {
    if (this.resetPasswordForm.valid) {


      this.closeModal();
    }
  }
  verifyAndSendEmail() {
    if (this.resetPasswordForm.invalid) {
      this.errorMessage = 'Veuillez entrer une adresse e-mail valide.';
      return;
    }

    const email = this.resetPasswordForm.value.email;

    this.forgetPasswordService.verifyEmail(email).subscribe({
      next: (response) => {
        console.log(' Email trouvé, envoi en cours...');


        this.router.navigate(['/new']);
      },
      error: (err) => {
        console.error(' Erreur :', err);
        this.errorMessage = "Cet email n'existe pas dans notre base de données.";
      }
    });
  }

  authenticate(): void {
    this.authService.authenticate(this.loginForm.value.email, this.loginForm.value.password).subscribe({
      next: (response) => {
        if (response?.access_token) {
          localStorage.setItem("accessToken", response.access_token);

          const decodedToken: any = jwtDecode(response.access_token);
          if (response.message) {
            if (response.status === 'ATTENTE') {
              this.toastr.warning(response.message, "Attention");
              return;
            }
            if (response.status === 'NONPAYE') {
              this.toastr.error(response.message, "Paiement requis");
              return;
            }
          }

          this.navigateByRole(decodedToken.role);

        } else {
          this.toastr.error("Vérifiez votre email ou mot de passe ❌", "Erreur");
        }
      },
      error: (error) => {
        if (error.status === 403) {
          this.toastr.warning(error.error ?? "Email ou mot de passe incorrect !", "Attention");
        } else {
          this.toastr.error("Une erreur est survenue lors de la connexion.", "Erreur");
        }
        console.error('Erreur:', error);
      }
    });
  }

  private navigateByRole(role: string): void {
    switch (role) {
      case 'PRESTATAIRE':
        this.router.navigate(['/Compteprestaitre']);
        break;
      case 'PARTICULIER':
        this.router.navigate(['/Compteparticulier']);
        break;
      case 'ADMINISTRATEUR':
        this.router.navigate(['/user']);
        break;
      case 'ENTREPRISE':
        this.router.navigate(['/Comptentreprise']);
        break;
      default:
        this.router.navigate(['/Front']);
        break;
    }
  }

  getImageUrl(filename: string): string {
    return `http://localhost:8087/nour/api/v1/auth/get-image/${filename}`;
  }
}

