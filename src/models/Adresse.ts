import { Demande } from "./Demande";
import { Utilisateur } from "./Utilisateur";

export class Adresse {


    idAdresse!: number;
  governoate!: string; 
  ville!: string;     
  utilisateurs?: Utilisateur[]; 
  demandes?: Demande[] = [];
  }