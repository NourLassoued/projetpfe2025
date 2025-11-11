import { Utilisateur } from "./Utilisateur";

export class Message {
    id?: number;
    sender?: Utilisateur;  
    receiver?: Utilisateur;
    content?: string;
    timestamp?: Date;
    delivered?: boolean;
    readTimestamp?: Date;
}