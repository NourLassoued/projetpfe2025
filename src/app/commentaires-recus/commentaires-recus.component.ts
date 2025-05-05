import { Component } from '@angular/core';
import { FileService } from '../service/file.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { PublicationService } from '../service/publication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-commentaires-recus',
  templateUrl: './commentaires-recus.component.html',
  styleUrls: ['./commentaires-recus.component.css']
})
export class CommentairesRecusComponent {
   constructor(
        private fileService: FileService,
        private sanitizer: DomSanitizer,
        private toastr: ToastrService,
        private publicationService: PublicationService,
        private router: Router,
      ) {}



      logout(): void {
        localStorage.removeItem('accessToken');
        this.router.navigate(['/Front']);
      }

}
