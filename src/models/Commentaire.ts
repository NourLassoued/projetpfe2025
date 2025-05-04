import { Publication } from "./Publication";
import { Utilisateur } from "./Utilisateur";

export interface Commentaire {
    id?: number;
    contenu: string;
    dateCommentaire?: Date;
    publication?: Publication;
    particulier?: Utilisateur;
  }