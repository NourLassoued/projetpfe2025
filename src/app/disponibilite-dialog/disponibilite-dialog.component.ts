import { Component, Inject } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-disponibilite-dialog',
  templateUrl: './disponibilite-dialog.component.html',
  styleUrls: ['./disponibilite-dialog.component.css']
})
export class DisponibiliteDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DisponibiliteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }


}
