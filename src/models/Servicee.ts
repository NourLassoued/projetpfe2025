import { Categorie } from "./Categorie";
import { Demande } from "./Demande";
import { Utilisateur } from "./Utilisateur";

export class Servicee {
    idservice?: number;
    nomservice?: string;
    imageService?: string;
    description?: string;
    tarif?: number;
    categorie?: Categorie;
    demandes?: Demande[];
    prestataires?: Utilisateur[];
  }