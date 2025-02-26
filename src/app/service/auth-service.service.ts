import { Injectable } from '@angular/core';

import { Utilisateur } from 'src/models/Utilisateur';
import {BehaviorSubject, map, Observable, tap} from "rxjs";
import { Router } from '@angular/router';
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  public userSubject: BehaviorSubject<Utilisateur | null>;
  public user: Observable<Utilisateur | null>;
  isconn: any=false;
  private baseUrl = 'http://localhost:8088/nour/api/v1/auth';

  constructor(private http: HttpClient, private router: Router) {
    this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user')!));
    this.user = this.userSubject.asObservable();
  }
  public get userValue() {
    return this.userSubject.value;
  }
  register(data: any) {
    return this.http.post<any>(`${this.baseUrl}/register`, data);
  }
  isLoggedInWithCredentials(email: string, password: string): boolean {
    const storedEmail = localStorage.getItem('email');
    const storedPassword = localStorage.getItem('password');
    console.log('Stored email and password:', storedEmail, storedPassword);
    return storedEmail === email && storedPassword === password;
  }

  logout(): void {
  
    localStorage.removeItem('email'); 
    localStorage.removeItem('password'); 
    this.router.navigate(['/login']); 
  }
 

 
 
  getAuthToken(): string {
    const token = localStorage.getItem('accessToken');
    console.log('SERVICE token is' + token)

    return token || 'EMPTY';
  }
  getAccessToken(): string {
    return localStorage.getItem('accessToken')!;
  }
authenticate(email: string, password: string): Observable<any> {
  const body = { email, password };
  return this.http.post<any>(`${this.baseUrl}/authenticate`, body)
    .pipe(
      tap(response => {
        
        localStorage.setItem('accessToken', response.access_token);
       
      })
    ); 
}
    



  refreshToken(refreshToken: string): Observable<any> {
    const body = { refreshToken };
    return this.http.post<any>(`${this.baseUrl}/refreshToken`, body);
  }
  getUserRole(): string | null {

    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
    
      const decodedToken = this.decodeAccessToken(accessToken);
      return decodedToken.role; 
    }
    return null;
  }

  private decodeAccessToken(token: string): any {
    
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  }



  isLoggedIn(): boolean {
  
    const token = localStorage.getItem('accessToken');
    return !!token; 
  }
  getCurrentUser(): Observable<any> {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
    
      return this.http.get<any>(`${this.baseUrl}/current-user`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
    } else {
    
      return new Observable(observer => {
        observer.error('Token d\'accès introuvable dans le localStorage.');
      });
    }
  }
  private isAdmin: boolean = false;

  setIsAdmin(isAdmin: boolean) {
    this.isAdmin = isAdmin;
  }

  getIsAdmin(): boolean {
    return this.isAdmin;
  }
  
}
