import { Utilisateur } from "./Utilisateur";

export class ForgotPassword {
    fpid?: number;
    otp?: number;
    expirationTime?: Date;
    user?: Utilisateur;
  }
  