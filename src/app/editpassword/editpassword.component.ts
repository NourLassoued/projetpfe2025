import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ForgetPasswordService } from '../service/forget-password.service';

@Component({
  selector: 'app-editpassword',
  templateUrl: './editpassword.component.html',
  styleUrls: ['./editpassword.component.css']
})
export class EditpasswordComponent  implements OnInit {
  password: string = '';
  repeatPassword: string = '';
  email: string | null = null;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private forgetPasswordService: ForgetPasswordService,
    private router: Router
  ) {}

  ngOnInit() {
    this.email = this.route.snapshot.queryParamMap.get('email');
  }

  changePassword() {
    if (!this.email) {
      this.errorMessage = "Erreur : Aucun email fourni.";
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = "Le mot de passe doit contenir au moins 6 caractères.";
      return;
    }

    if (this.password !== this.repeatPassword) {
      this.errorMessage = "Les mots de passe ne correspondent pas.";
      return;
    }

    this.forgetPasswordService.changePassword(this.email, this.password, this.repeatPassword).subscribe({
      next: () => {
        this.successMessage = "Mot de passe changé avec succès ! Redirection...";
        setTimeout(() => this.router.navigate(['/login']), 3000); // Redirige vers login après 3s
      },
      error: () => {
        this.errorMessage = "Une erreur est survenue lors du changement du mot de passe.";
      }
    });
  }
}
  

