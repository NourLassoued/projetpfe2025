import { Adresse } from "./Adresse";
import { Avis } from "./Avis";
import { Commentaire } from "./Commentaire";
import { Disponibilite } from "./Disponibilite";
import { Message } from "./Message";
import { Payment } from "./Payment";
import { Postulation } from "./Postulation";
import { Publication } from "./Publication";
import { Servicee } from "./Servicee";
import { StatusUtilisateur } from "./StatusUtilisateur";
import { UserRole } from "./UserRole";

export class Utilisateur {
  idUtilisateur?: number;
  nom?: string;
  email?: string;
  password?: string;
  image?: string;
  telephoneNumber?: number;

  role?: UserRole;
  status?: StatusUtilisateur;
  createdAt?: Date;
  Certification?: string;
  competence?: string[];
  tarifs?: number;
  disponibilite?: any;
  description?: string;
  showFullDescription?: boolean;
  solde?: number;
  workExperience?: number;
  nomEntreprise?: string;
  siret?: string;
  siteWeb?: string;
  doucument_cv?: string;
  doucument_CIN?: string;
  [key: string]: any;
  servicesOfferts?: Servicee[];
  disponibilites?: Disponibilite[];
  adressee?: Adresse;
  postulations?: Postulation[];
  avisDonnes?: Avis[];
  avisRecus?: Avis[];
  messagesEnvoyes?: Message[];
  messagesRecus?: Message[];
  paymentsAsParticulier?: Payment[];
  paymentsAsPrestataire?: Payment[];
  publications?: Publication[];
  commentaires?: Commentaire[];
  notifications?: Notification[];
}

