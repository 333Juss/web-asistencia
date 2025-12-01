import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-justificar-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './justificar-modal.component.html',
  styleUrls: ['./justificar-modal.component.scss']
})
export class JustificarModalComponent {

  motivo: string = '';
  archivo: File | null = null;
  archivoNombre: string = '';

  constructor(
    public dialogRef: MatDialogRef<JustificarModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.archivo = event.target.files[0];
      this.archivoNombre = this.archivo?.name ?? '';
    }
  }

  enviar() {
    this.dialogRef.close({
      motivo: this.motivo,
      archivo: this.archivo
    });
  }

  cancelar() {
    this.dialogRef.close(null);
  }
}
