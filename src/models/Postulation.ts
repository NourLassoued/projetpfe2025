import { Demande } from "./Demande";
import { Utilisateur } from "./Utilisateur";

export class Postulation {
    id?: number;
    commentaire?: string;
    datePostulation?: Date;
    demande?: Demande;  
    prestataire?: Utilisateur;
}