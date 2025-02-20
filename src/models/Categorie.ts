import { Servicee } from "./Servicee";

export class Categorie {
    id?: number;
    nom?: string;
    description?: string;
    imageCategorie?: string;
    tarif?: number;
    services?: Servicee[];
  }
  