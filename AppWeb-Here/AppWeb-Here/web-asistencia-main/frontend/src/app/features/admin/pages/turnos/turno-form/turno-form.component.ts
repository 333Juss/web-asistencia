import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { TurnoService } from '../../../services/turno.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { Turno } from '../../../../../components/models';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCheckbox} from '@angular/material/checkbox';

@Component({
  selector: 'app-turno-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatCheckbox
  ],
  templateUrl: './turno-form.component.html',
  styleUrls: ['./turno-form.component.scss']
})
export class TurnoFormComponent implements OnInit {

  form!: FormGroup;
  loading = false;
  submitting = false;
  isEditMode = false;
  turnoId?: number;

  constructor(
    private fb: FormBuilder,
    private turnoService: TurnoService,
    private notify: NotificationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.turnoId = Number(this.route.snapshot.paramMap.get('id'));
    this.isEditMode = !!this.turnoId;
    this.buildForm();

    if (this.isEditMode) this.loadTurno();
  }

  buildForm() {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      horaInicio: ['', Validators.required],
      horaFin: ['', Validators.required],
      toleranciaMinutos: [10, [Validators.required, Validators.min(0)]],
      activo: [true]
    });
  }


  loadTurno() {
    this.loading = true;
    this.turnoService.getTurnoById(this.turnoId!).subscribe(res => {
      this.form.patchValue(res.data);
      this.loading = false;
    });
  }

  submit() {
    if (this.form.invalid) return;

    const turno = { ...this.form.value };
    if (!this.isEditMode) delete turno.id;
    this.submitting = true;

    const request = this.isEditMode
      ? this.turnoService.updateTurno(this.turnoId!, turno)
      : this.turnoService.createTurno(turno);

    request.subscribe({
      next: () => {
        this.notify.success(
          this.isEditMode ? 'Turno actualizado' : 'Turno creado'
        );
        this.router.navigate(['/admin/turnos']);
      },
      error: () => this.submitting = false
    });
  }

  cancel() {
    this.router.navigate(['/admin/turnos']);
  }
}
