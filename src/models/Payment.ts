import { Reservation } from "./Reservation";
import { StatusPayment } from "./StatusPayment";
import { Utilisateur } from "./Utilisateur";

export interface Payment {
    idpaymemnt?: number;          
    paymentId?: string;
    paymentStatus?: StatusPayment;
    amount: number;
    reservation: Reservation;
    particulier: Utilisateur;
    prestataire: Utilisateur;
  }