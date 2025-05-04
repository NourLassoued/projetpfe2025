import { Publication } from "./Publication";
import { Utilisateur } from "./Utilisateur";

export interface Notification {
    id?: number;            
    message: string;
    isSeen: boolean;
    timestamp: string;
    user: Utilisateur;
    publication: Publication;
  }