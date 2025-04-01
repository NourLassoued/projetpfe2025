import { Adresse } from "./Adresse";
import { Postulation } from "./Postulation";
import { Reservation } from "./Reservation";
import { Servicee } from "./Servicee";
import { StatusDemande } from "./StatusDemande";
import { Utilisateur } from "./Utilisateur";

export class Demande {
    idDemande?: number;
    date?: Date;
    description?: string;
    title?: string; 
    telephoneNumber?: number;
    statusDemande?: StatusDemande;
    heureTravail?: number;
    demandephoto?: string;
    utilisateur?: Utilisateur;
    servicee?: Servicee;
    adressedemande?: Adresse;
    postulations?: Postulation[];
    reservation?: Reservation; 
  }
  