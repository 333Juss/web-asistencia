import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { TurnoService } from '../../../services/turno.service';
import { NotificationService } from '../../../../../core/services/notification.service';

@Component({
  selector: 'app-turno-create-dialog',
  standalone: true,
  templateUrl: './turno-create-dialog.component.html',
  styleUrls: ['./turno-create-dialog.component.scss'],
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class TurnoCreateDialogComponent {

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private turnoService: TurnoService,
    private dialogRef: MatDialogRef<TurnoCreateDialogComponent>,
    private notificationService: NotificationService
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      horaInicio: ['', Validators.required],
      horaFin: ['', Validators.required],
      toleranciaMinutos: [0, Validators.required]
    });
  }

  guardar(): void {
    if (this.form.invalid) return;

    this.turnoService.createTurno(this.form.value).subscribe({
      next: () => {
        this.notificationService.success('Turno creado correctamente');
        this.dialogRef.close(true);
      },
      error: () => this.notificationService.error('Error al crear turno')
    });
  }

  cerrar(): void {
    this.dialogRef.close(false);
  }
}
