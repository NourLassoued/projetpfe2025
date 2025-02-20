import { StatusReservation } from "./StatusReservation";
import { Utilisateur } from "./Utilisateur";

export class Reservation {
    idReservation?: number;
    dateReservation?: Date;
    statusReservation?: StatusReservation;
    description?: string;
    particulier?: Utilisateur;
    prestataire?: Utilisateur;
  }