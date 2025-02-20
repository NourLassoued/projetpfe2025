import { Utilisateur } from "./Utilisateur";

export class Avis {
    idAvis?: number;
    note?: number;
    commentaire?: string;
    dateAvis?: Date;
    utilisateur?: Utilisateur;
    avisUtilisateur?: Utilisateur;
  }