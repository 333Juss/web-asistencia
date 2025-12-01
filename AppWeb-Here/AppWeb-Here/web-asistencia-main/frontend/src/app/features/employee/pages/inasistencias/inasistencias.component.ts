import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '../../../../core/services/auth.service';

import { AsistenciaService } from '../../services/asistencia.service';
import { JustificacionService } from '../../services/justificacion.service';

import { JustificarModalComponent } from './justificar-modal.component';

@Component({
  selector: 'app-inasistencias',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatDialogModule],
  templateUrl: './inasistencias.component.html',
  styleUrls: ['./inasistencias.component.scss']
})
export class InasistenciasComponent implements OnInit {

  displayedColumns = ['fecha', 'turno', 'estado', 'justificacion', 'accion'];
  inasistencias: any[] = [];
  colaboradorId!: number;

  constructor(
    private asistenciaService: AsistenciaService,
    private justificacionService: JustificacionService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const col = this.authService.getCurrentColaborador();
    this.colaboradorId = col!.id!;
    this.load();
  }

  load(): void {
    this.asistenciaService.listarInasistenciasConJustificacion(this.colaboradorId)
      .subscribe({
        next: (res: any[]) => this.inasistencias = res,
        error: (err: any) => console.error("ERROR:", err)
      });
  }


  abrirModal(asistencia: any): void {
    const ref = this.dialog.open(JustificarModalComponent, {
      width: '420px',
      data: asistencia
    });

    ref.afterClosed().subscribe(result => {
      if (!result) return;

      const formData = new FormData();
      formData.append("motivo", result.motivo);

      if (result.archivo) {
        formData.append("archivo", result.archivo);
      }

      this.justificacionService.enviarJustificacion(
        asistencia.asistenciaId,
        this.colaboradorId,
        formData
      ).subscribe({
        next: () => this.load(),
        error: err => console.error(err)
      });
    });
  }


  getColor(estado: string): string {
    switch (estado) {
      case 'FALTA': return 'red';
      case 'PENDIENTE_JUSTIFICACION': return 'orange';
      case 'JUSTIFICADA': return 'green';
      default: return 'black';
    }
  }
}
