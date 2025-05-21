import { PaymentAbonnement } from "./PaymentAbonnement";
import { StatusAbonnement } from "./StatusAbonnement ";
import { TypeAbonnement } from "./TypeAbonnement";
import { Utilisateur } from "./Utilisateur";

export class Abonnement {
  idAbonnement ?: number;
  typeAbonnement?: TypeAbonnement;
  dateDebut ?: Date;  
  dateFin ?: Date;    
  statusAbonnement ?: StatusAbonnement;
  montant ?: number;
  autoRenouvellement ?: boolean;
  utilisateur ?: Utilisateur;         
  paymentAbonnement?: PaymentAbonnement;  
}