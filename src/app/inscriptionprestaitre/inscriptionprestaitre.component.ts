import { Component } from '@angular/core';

@Component({
  selector: 'app-inscriptionprestaitre',
  templateUrl: './inscriptionprestaitre.component.html',
  styleUrls: ['./inscriptionprestaitre.component.css']
})
export class InscriptionprestaitreComponent {
  showModal: boolean = false;

  openModal() {
    console.log("✅ Modal ouverte !");
    this.showModal = true;
  }

  closeModal() {
    console.log("❌ Modal fermée !");
    this.showModal = false;
  }
}


