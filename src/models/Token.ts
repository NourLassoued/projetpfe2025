import { Utilisateur } from "./Utilisateur";

export enum TokenType {
    BEARER = "BEARER"
  }
  
export class Token {
    id?: number;
    token?: string;
    tokenType?: TokenType;
    expired?: boolean;
    revoked?: boolean;
    user?: Utilisateur;
  }