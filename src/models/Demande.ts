import { Servicee } from "./Servicee";
import { StatusDemande } from "./StatusDemande";
import { Utilisateur } from "./Utilisateur";

export class Demande {
    idDemande?: number;
    date?: Date;
    description?: string;
    title?: string;
    adresse?: string;
    statusDemande?: StatusDemande;
    heureTravail?: number;
    demandephoto?: string;
    utilisateur?: Utilisateur;
    servicee?: Servicee;
  }
  