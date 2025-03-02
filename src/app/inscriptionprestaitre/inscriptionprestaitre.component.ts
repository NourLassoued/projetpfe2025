import { Component } from '@angular/core';

@Component({
  selector: 'app-inscriptionprestaitre',
  templateUrl: './inscriptionprestaitre.component.html',
  styleUrls: ['./inscriptionprestaitre.component.css']
})
export class InscriptionprestaitreComponent {
  showModal: boolean = false;

  openModal() {
   
    this.showModal = true;
  }

  closeModal() {
   ;
    this.showModal = false;
  }
}


