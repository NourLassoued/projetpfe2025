import { Demande } from "./Demande";
import { StatusReservation } from "./StatusReservation";
import { Utilisateur } from "./Utilisateur";

export class Reservation {
    idReservation?: number;
    dateReservation?: Date;
    statusReservation?: StatusReservation;
    particulier?: Utilisateur;
    prestataire?: Utilisateur;
    demande?: Demande;
  }