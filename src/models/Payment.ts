import { Reservation } from "./Reservation";
import { StatusPayment } from "./StatusPayment";
import { Utilisateur } from "./Utilisateur";

export interface Payment {
    idpaymemnt?: number;          
    paymentId?: string;
    paymentStatus?: StatusPayment;
    amount: number;
    modePaiement?:String;
    reservation: Reservation;
    particulier: Utilisateur;
    prestataire: Utilisateur;
  }