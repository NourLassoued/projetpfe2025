import { Utilisateur } from "./Utilisateur";

export class Message {
    id?: number;
    sender?: Utilisateur;  // Vous pouvez préciser le type si vous avez une classe Utilisateur en Angular
    receiver?: Utilisateur;
    content?: string;
    timestamp?: Date;
    delivered?: boolean;
    readTimestamp?: Date;
}