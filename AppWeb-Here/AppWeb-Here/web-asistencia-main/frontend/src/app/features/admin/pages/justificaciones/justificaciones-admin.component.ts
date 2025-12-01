import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

import {
  JustificacionAdminService,
  JustificacionPendiente
} from '../../services/justificacion-admin.service';

import { ResponderModalComponent } from './responder-modal.component';

@Component({
  selector: 'app-justificaciones-admin',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule],
  templateUrl: './justificaciones-admin.component.html',
  styleUrls: ['./justificaciones-admin.component.scss']
})
export class JustificacionesAdminComponent implements OnInit {

  displayedColumns = ['colaborador', 'fecha', 'motivo','estado' ,'acciones'];
  justificaciones: JustificacionPendiente[] = [];

  constructor(
    private service: JustificacionAdminService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar() {
    this.service.listarTodas().subscribe({
      next: (data) => {
        console.log("JUSTIFICACIONES RECIBIDAS:", data);
        this.justificaciones = data;
      },
      error: (err) => console.error("Error cargando:", err)
    });
  }

  revisar(j: JustificacionPendiente) {
    const ref = this.dialog.open(ResponderModalComponent, {
      width: '450px',
      data: j,
      disableClose: true
    });

    ref.afterClosed().subscribe(result => {
      if (!result) return; // Cancelado

      if (result.accion === 'APROBAR') {
        this.service.aprobar(j.id, result.respuesta).subscribe({
          next: () => this.cargar(),
          error: e => console.error('Error al aprobar', e)
        });
      }

      if (result.accion === 'RECHAZAR') {
        this.service.rechazar(j.id, result.respuesta).subscribe({
          next: () => this.cargar(),
          error: e => console.error('Error al rechazar', e)
        });
      }
    });
  }

}
