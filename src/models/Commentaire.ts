import { Publication } from "./Publication";
import { Utilisateur } from "./Utilisateur";

export interface Commentaire {
    id?: number;
    contenu: string;
    dateCommentaire?: Date;
    Like?: number;
    likedByParticulier?: boolean;
    publication?: Publication;
    particulier?: Utilisateur;
  }