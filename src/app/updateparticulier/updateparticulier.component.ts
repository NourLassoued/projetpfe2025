import { Component, ElementRef, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FileService } from '../service/file.service';
import { AdresseService } from '../service/adresse.service';
import { ForgetPasswordService } from '../service/forget-password.service';
import { Router } from '@angular/router';
import { UtilisateurService } from '../service/utilisateur.service';
import { Adresse } from 'src/models/Adresse';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-updateparticulier',
  templateUrl: './updateparticulier.component.html',
  styleUrls: ['./updateparticulier.component.css']
})
export class UpdateparticulierComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;
  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }
  selectedFile: File | null = null;
  isEditing: { [key: string]: boolean } = {};
  editedValues: { [key: string]: string } = {};
  userId: number | null = null;
  profileImageUrl: SafeUrl | null = null;
  selectedFiles: { [key: string]: File } = {};
  passwordData = {
    oldPassword: '',
    password: '',
    repeatPassword: ''

  };
  selectedAdresse: any;
  adresses: Adresse[] = [];
  user: any = null;
  imageUrls: string[] = [];
  passwordError = '';
  emailExists: boolean = false;
  emailError: string | null = null;
  email: string = '';
  constructor(private readonly fileService: FileService,
    private readonly sanitizer: DomSanitizer,
    private readonly router: Router,
    private readonly utilisateurService: UtilisateurService,


    private readonly forgetPasswordService: ForgetPasswordService,
    private readonly uploadService: FileService,
    private readonly adreesse: AdresseService) { }


  ngOnInit(): void {

    this.loadAdresses();
    this.loadUserData();






    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.warn(" Aucun service trouvé dans le token !");
    }
  }


  loadAdresses(): void {
    this.adreesse.getAllAdresses().subscribe((data) => {
      this.adresses = data;
    });
  }

  loadProfileImage(filename: string): void {
    this.fileService.getImage(filename).subscribe({
      next: (imageBlob) => {
        const objectURL = URL.createObjectURL(imageBlob);
        this.profileImageUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      },
      error: (err) => {
        console.error(' Erreur de chargement de l\'image', err);
        this.profileImageUrl = null;
      }
    });
  }


  loadUserData(): void {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      console.error(" Aucun token trouvé !");
      return;
    }

    try {
      const decodedToken: any = jwtDecode(token);

      if (!decodedToken.id) {
        console.error(" L'ID utilisateur est introuvable dans le token !");
        return;
      }

      this.user = decodedToken;
      this.userId = decodedToken.id;
      if (this.user.image) {
        this.loadProfileImage(this.user.image);
      } else {
        console.warn(" Aucune image trouvée dans le token !");
      }

    } catch (error) {
      console.error("Erreur lors du décodage du token :", error);
    }


  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.updateProfileImage();
    }
  }


  getImage(filename: string, index: number) {
    this.fileService.getImage(filename).subscribe({
      next: (imageBlob) => {
        const imageUrl = URL.createObjectURL(imageBlob);
        this.imageUrls[index] = imageUrl;
      },
      error: (error) => {
        console.error('Erreur lors du chargement de l\'image', error);
      }
    });
  }
  updateProfileImage() {
    this.loadUserData();
    if (!this.userId) {
      console.error(" Impossible de mettre à jour : ID utilisateur introuvable !");
      return;
    }

    if (!this.selectedFile) {
      console.error("Aucun fichier sélectionné !");
      return;
    }

    this.uploadService.uploadFile(this.selectedFile).subscribe({
      next: (response: string) => {
        console.log("Réponse du backend :", response);

        const regex = /File uploaded successfully: (.+)/;
        const match = regex.exec(response);
        const filename = match ? match[1] : null;

        if (!filename) {
          console.error("Nom de fichier invalide après l'upload !");
          return;
        }

        console.log("Nom de fichier extrait :", filename);

        this.utilisateurService.updateUser(Number(this.userId), { image: filename })
          .subscribe({
            next: (response) => {
              console.log("Profil mis à jour avec succès :", response);

              const updatedImageUrl = `http://localhost:8088/nour/api/v1/auth/get-image/${filename}?t=${new Date().getTime()}`;
              this.profileImageUrl = updatedImageUrl;

              this.fileService.updateProfileImage(updatedImageUrl);

              if (response.token) {
                localStorage.removeItem('accessToken');
                localStorage.setItem('accessToken', response.token);
              }

              this.loadUserData();
            },
            error: (err) => {
              console.error("Erreur lors de la mise à jour du profil :", err);
            }
          });
      },
      error: (err) => {
        console.error("Erreur lors de l'upload :", err);
      }
    });

  }
  startEditing(field: string, currentValue: string) {
    this.isEditing[field] = true;
    this.editedValues[field] = currentValue;
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

  saveChanges(field: string) {
    if (!this.userId) {
      console.error(" Impossible de mettre à jour : ID utilisateur introuvable !");
      return;
    }

    switch (field) {
      case "profileImage":
        if (this.selectedFile) {
          this.updateProfileImage();
        }
        break;
      case "password":
        this.handlePasswordChange(field);
        break;
      case "email":
        this.handleEmailChange(field);
        break;
      case "adresse":
        this.handleAdresseChange(field);
        break;
      default:
        this.handleDefaultFieldChange(field);
        break;
    }
  }

  private handlePasswordChange(field: string) {
    const newPassword = this.editedValues['password'];
    const confirmPassword = this.editedValues['confirmPassword'];

    if (!newPassword || !confirmPassword) {
      this.passwordError = "Veuillez remplir tous les champs.";
      return;
    }

    if (newPassword.length < 6) {
      this.passwordError = "Le mot de passe doit contenir au moins 6 caractères.";
      return;
    }
    if (!/[A-Z]/.test(newPassword)) {
      this.passwordError = "⚠️ Le mot de passe doit contenir au moins une majuscule.";
      return;
    }

    if (!/\d/.test(newPassword)) {
      this.passwordError = "⚠️ Le mot de passe doit contenir au moins un chiffre.";
      return;
    }

    if (newPassword !== confirmPassword) {
      this.passwordError = "Les mots de passe ne correspondent pas.";
      return;
    }

    this.forgetPasswordService.changePassword(this.userId!, newPassword, confirmPassword)
      .subscribe({
        next: () => {
          this.isEditing[field] = false;
          this.passwordError = "";
        },
        error: (err) => {
          console.error("Erreur lors du changement de mot de passe :", err);
          this.passwordError = err.error ?? "Une erreur est survenue.";
        }
      });
  }

  private handleEmailChange(field: string) {
    const email = this.editedValues['email'];

    if (!email) {
      this.emailError = "⚠️ Veuillez entrer un email.";
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      this.emailError = "⚠️ Veuillez entrer un email valide.";
      return;
    }
    this.utilisateurService.checkEmailExists(email).subscribe({
      next: (exists) => {
        if (exists) {
          this.emailError = "⚠️ Cet email est déjà utilisé.";
          return;
        }
        if (this.userId === null) {
          console.error("L'ID utilisateur est introuvable.");
          return;
        }

        this.utilisateurService.updateUser(this.userId, { email })
          .subscribe({
            next: (response) => {
              this.user.email = email;
              this.isEditing[field] = false;
              this.emailError = "";
            },
            error: (err) => {
              console.error("❌ Erreur lors de la mise à jour de l'email :", err);
              this.emailError = err.error ?? "⚠️ Une erreur est survenue.";
            }
          });
      },
      error: (err) => {
        console.error("Erreur lors de la vérification de l'email", err);
        this.emailError = "⚠️ Une erreur est survenue lors de la vérification de l'email.";
      }
    });
  }

  private handleAdresseChange(field: string) {
    if (!this.selectedAdresse) {
      console.error("Aucune adresse sélectionnée !");
      return;
    }

    let adresseObjet = typeof this.selectedAdresse === 'string'
      ? this.adresses.find(a => a.governoate === this.selectedAdresse)
      : this.selectedAdresse;

    if (!adresseObjet?.idAdresse) {
      console.error(" Adresse introuvable !");
      return;
    }

    this.utilisateurService.affecterAdresse(this.userId!, adresseObjet.idAdresse)
      .subscribe({
        next: (response) => {
          console.log(` ${field} mis à jour avec succès :`, response);

          if (response.token) {
            localStorage.removeItem('accessToken');
            localStorage.setItem('accessToken', response.token);
          }
          this.user.adresse = adresseObjet;
          this.isEditing[field] = false;
        },
        error: (err) => {
          console.error(" Erreur lors de la mise à jour de l'adresse :", err);
        }
      });
  }

  private handleDefaultFieldChange(field: string) {
    const updatedData = { [field]: this.editedValues[field] };

    this.utilisateurService.updateUser(this.userId!, updatedData)
      .subscribe({
        next: (response) => {
          console.log(` ${field} mis à jour avec succès :`, response);

          if (response.token) {
            localStorage.removeItem('accessToken');
            localStorage.setItem('accessToken', response.token);
          }

          this.user[field] = updatedData[field];
          this.isEditing[field] = false;
        },
        error: (err) => {
          console.error(`Erreur lors de la mise à jour de ${field} :`, err);
        }
      });
  }

  logout(): void {

    localStorage.removeItem('accessToken')
    this.router.navigate(['/Front']);
  }
}







