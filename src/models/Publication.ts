import { Commentaire } from "./Commentaire";
import { Utilisateur } from "./Utilisateur";

export interface Publication {
    id?: number;
    titre: string;
    description: string;
    datePublication?: Date;
    entreprise?: Utilisateur;
    commentaires?: Commentaire[];
    notifications?: Notification[];
  }