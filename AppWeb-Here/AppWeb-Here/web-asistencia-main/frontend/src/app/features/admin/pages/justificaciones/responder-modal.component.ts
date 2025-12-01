import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-responder-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './responder-modal.component.html',
  styleUrls: ['./responder-modal.component.scss']
})
export class ResponderModalComponent {

  respuesta: string = '';

  constructor(
    public dialogRef: MatDialogRef<ResponderModalComponent>,
    @Inject(MAT_DIALOG_DATA) public j: any
  ) {}

  /** 🔥 Devuelve la URL completa del archivo */
  getArchivoUrl(path: string): string {
    return 'http://localhost:8080' + path;
  }

  esImagen(path: string): boolean {
    return /\.(jpg|jpeg|png|gif)$/i.test(path);
  }

  aprobar() {
    this.dialogRef.close({ accion: 'APROBAR', respuesta: this.respuesta });
  }

  rechazar() {
    this.dialogRef.close({ accion: 'RECHAZAR', respuesta: this.respuesta });
  }

  cancelar() {
    this.dialogRef.close(null);
  }
}
