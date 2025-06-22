import { Component } from '@angular/core';


import { Router } from '@angular/router';

@Component({
  selector: 'app-commentaires-recus',
  templateUrl: './commentaires-recus.component.html',
  styleUrls: ['./commentaires-recus.component.css']
})
export class CommentairesRecusComponent {
  constructor(private readonly router: Router) { }



  logout(): void {
    localStorage.removeItem('accessToken');
    this.router.navigate(['/Front']);
  }

}
