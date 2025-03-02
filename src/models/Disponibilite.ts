import { Utilisateur } from "./Utilisateur";

export class Disponibilite {
    id?: number;          
    jour?: string;
    heureDebut?: string; 
    heureFin?: string;
    prestataire?: Utilisateur;
    
  }
  