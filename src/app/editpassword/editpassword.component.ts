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
  id: number = 0; 
  constructor(
    private route: ActivatedRoute,
    private forgetPasswordService: ForgetPasswordService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.id = +params['id'];  // Récupérer l'ID de l'URL et le convertir en nombre
    });
  
  }
  changePassword(): void {
    // Validation des champs
    if (!this.id) {
      this.errorMessage = "Erreur : Aucun ID utilisateur fourni.";
      return;
    }

    if (!this.password || !this.repeatPassword) {
      this.errorMessage = "Erreur : Les mots de passe ne peuvent pas être vides.";
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

    // Appeler le service pour changer le mot de passe en passant l'ID et les mots de passe
    this.forgetPasswordService.changePassword(this.id, this.password, this.repeatPassword).subscribe({
      next: () => {
        this.successMessage = "Mot de passe changé avec succès ! Redirection...";
        setTimeout(() => this.router.navigate(['/login']), 3000);  // Redirection vers la page de login après 3 secondes
      },
      error: (err) => {
        this.errorMessage = "Une erreur est survenue lors du changement du mot de passe.";
        console.error(err);  // Affiche l'erreur pour aider à déboguer
      }
    });
  }
}