import { Disponibilite } from "./Disponibilite";
import { Servicee } from "./Servicee";
import { StatusUtilisateur } from "./StatusUtilisateur";
import { UserRole } from "./UserRole";




export class Utilisateur {
    idUtilisateur?: number;
    nom ?: string ;
    email?: string;
    password?: string;
    image?: string;
    telephoneNumber?: number;
    adresse?: string;
    role?: UserRole;
    status?: StatusUtilisateur;
    createdAt?: Date;
    Certification?: string;
    competence?: string[];
    tarifs?: number;
    disponibilite?: any; 
    description?: string;
    solde?: number;
    workExperience?: number;
    nomEntreprise?: string;
    siret?: string;
    siteWeb?: string;
    doucument_cv?: string;
    doucument_CIN?: string;
    servicesOfferts?: Servicee[];
    disponibilites?: Disponibilite[];
  }
  