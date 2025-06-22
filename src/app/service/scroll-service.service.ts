import { Injectable } from '@angular/core';
import {  NavigationStart, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ScrollServiceService {

  constructor(private  readonly router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        const shouldScrollToTop = this.shouldScrollToTop(event.url);
        if (shouldScrollToTop) {
          window.scrollTo(0, 0); 
        }
      }
    });
  }

  private shouldScrollToTop(url: string): boolean {
    const scrollToTopPages = ['/Compte/:id', '/Profil']; 
    return scrollToTopPages.some(path => url.includes(path));
  }
}

