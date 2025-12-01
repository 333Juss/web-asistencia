import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder, FormGroup, Validators, ReactiveFormsModule,
  AbstractControl, ValidationErrors
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable, of } from 'rxjs';
import { map, catchError, debounceTime, switchMap } from 'rxjs/operators';

import {
  Colaborador,
  ColaboradorCreateDto,
  ColaboradorUpdateDto,
  Sede,
  Turno
} from '../../../../../components/models';

import { ColaboradorService } from '../../../services/colaborador.service';
import { SedeService } from '../../../services/sede.service';
import { TurnoService } from '../../../services/turno.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import {MatSlideToggle} from '@angular/material/slide-toggle';

@Component({
  selector: 'app-colaborador-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
    MatSlideToggle
  ],
  templateUrl: './colaborador-form.component.html',
  styleUrls: ['./colaborador-form.component.scss']
})
export class ColaboradorFormComponent implements OnInit {

  hidePassword = true;
  colaboradorForm!: FormGroup;
  isEditMode = false;
  colaboradorId?: number;
  loading = false;
  submitting = false;


  empresaId?: number;

  sedes: Sede[] = [];
  turnos: Turno[] = [];

  loadingSedes = false;
  loadingTurnos = false;

  cargos: string[] = [
    'Gerente',
    'Supervisor',
    'Vendedor',
    'Cajero',
    'Almacenero',
    'Administrativo',
    'Seguridad',
    'Limpieza'
  ];

  constructor(
    private fb: FormBuilder,
    private colaboradorService: ColaboradorService,
    private turnoService: TurnoService,
    private sedeService: SedeService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadSedes();
    this.loadTurnos();
    this.checkEditMode();
  }

  // =============================
  // Helpers
  // =============================
  private toISO(date: any): string | null {
    if (!date) return null;
    return new Date(date).toISOString().split('T')[0];
  }

  // =============================
  // Load Data
  // =============================
  private loadSedes(): void {
    this.loadingSedes = true;

    this.sedeService.getSedesActivas().subscribe({
      next: (response) => {
        if (response.success) this.sedes = response.data?? [];
        this.loadingSedes = false;
      },
      error: () => {
        this.loadingSedes = false;
        this.notificationService.error('Error al cargar las sedes');
      }
    });
  }

  private loadTurnos(): void {
    this.loadingTurnos = true;

    this.turnoService.getTurnos({ page: 0, size: 100 }).subscribe({
      next: (res) => {
        this.turnos = res.data.content; // ←🔥 Aquí el fix
      },
      error: () => {
        this.turnos = [];
      }
    });
  }

  // =============================
  // Form Init
  // =============================
  private initForm(): void {
    this.colaboradorForm = this.fb.group({
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)], [this.dniAsyncValidator.bind(this)]],
      nombres: ['', [Validators.required, Validators.minLength(2)]],
      apellidos: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email], [this.emailAsyncValidator.bind(this)]],
      telefono: ['', [Validators.pattern(/^\d{9}$/)]],
      fechaNacimiento: [''],
      fechaIngreso: ['', Validators.required],
      cargo: [''],
      sedeId: ['', Validators.required],

      // US08 Turno
      turnoId: ['', Validators.required],
      fechaInicioTurno: ['', Validators.required],

      crearUsuario: [true],
      username: [''],
      passwordTemporal: ['']
    });

    // Activación de campos de usuario
    this.colaboradorForm.get('crearUsuario')?.valueChanges.subscribe(crearUsuario => {
      const usernameControl = this.colaboradorForm.get('username');
      const passwordControl = this.colaboradorForm.get('passwordTemporal');

      if (crearUsuario) {
        usernameControl?.setValidators([Validators.required, Validators.minLength(3)]);
        passwordControl?.setValidators([Validators.required, Validators.minLength(6)]);
      } else {
        usernameControl?.clearValidators();
        passwordControl?.clearValidators();
        usernameControl?.setValue('');
        passwordControl?.setValue('');
      }

      usernameControl?.updateValueAndValidity();
      passwordControl?.updateValueAndValidity();
    });
  }

  // =============================
  // Edit Mode
  // =============================
  private checkEditMode(): void {
    this.colaboradorId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.colaboradorId) {
      this.isEditMode = true;
      this.loadColaborador(this.colaboradorId);
    }
  }

  private loadColaborador(id: number): void {
    this.loading = true;

    this.colaboradorService.getColaboradorById(id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.populateForm(response.data);
        }
      },
      error: () => {
        this.loading = false;
        this.notificationService.error('Error al cargar colaborador');
        this.goBack();
      }
    });
  }

  private populateForm(colaborador: Colaborador): void {
    this.empresaId = colaborador.empresaId;

    const fechaNacimiento = colaborador.fechaNacimiento ? new Date(colaborador.fechaNacimiento) : null;
    const fechaIngreso = colaborador.fechaIngreso ? new Date(colaborador.fechaIngreso) : null;
    const fechaInicioTurno = colaborador.fechaInicioTurno ? new Date(colaborador.fechaInicioTurno) : null;

    this.colaboradorForm.patchValue({
      dni: colaborador.dni,
      nombres: colaborador.nombres,
      apellidos: colaborador.apellidos,
      email: colaborador.email,
      telefono: colaborador.telefono,
      fechaNacimiento,
      fechaIngreso,
      cargo: colaborador.cargo,
      sedeId: colaborador.sedeId,
      turnoId: colaborador.turnoId,
      fechaInicioTurno
    });

    this.loading = false;
  }

  // =============================
  // Validators
  // =============================
  private dniAsyncValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    if (!control.value || control.value.length !== 8) return of(null);

    return this.colaboradorService.checkDniExists(control.value, this.colaboradorId).pipe(
      map(res => res.data?.exists ? { dniExists: true } : null),
      catchError(() => of(null))
    );
  }

  private emailAsyncValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    if (!control.value) return of(null);

    return this.colaboradorService.checkEmailExists(control.value, this.colaboradorId).pipe(
      map(res => res.data?.exists ? { emailExists: true } : null),
      catchError(() => of(null))
    );
  }

  // =============================
  // Submit
  // =============================
  onSubmit(): void {
    if (this.colaboradorForm.invalid) {
      this.markFormGroupTouched(this.colaboradorForm);
      this.notificationService.warning('Por favor completa los campos requeridos');
      return;
    }

    this.submitting = true;

    if (this.isEditMode) {
      this.updateColaborador();
    } else {
      this.createColaborador();
    }
  }

  private createColaborador(): void {
    const dto: ColaboradorCreateDto = {
      ...this.colaboradorForm.value,
      empresaId: 1,
      fechaInicioTurno: this.toISO(this.colaboradorForm.value.fechaInicioTurno),
      crearUsuario: true
    };

    this.colaboradorService.createColaborador(dto).subscribe({
      next: (response) => {
        this.submitting = false;

        if (response.success && response.data) {
          if (response.data.usuarioCreado) {
            this.notificationService.success(
              `Usuario creado:
Usuario: ${response.data.username}
Contraseña temporal: ${response.data.passwordTemporal}`, 15000);
          } else {
            this.notificationService.success('Colaborador registrado correctamente');
          }
        }
        this.goBack();
      },
      error: () => this.submitting = false
    });
  }

  private updateColaborador(): void {
    const dto: ColaboradorUpdateDto = {
      id: this.colaboradorId!,
      empresaId: this.empresaId || 1,
      ...this.colaboradorForm.value,
      fechaInicioTurno: this.toISO(this.colaboradorForm.value.fechaInicioTurno)
    };

    this.colaboradorService.updateColaborador(this.colaboradorId!, dto).subscribe({
      next: (response) => {
        this.submitting = false;
        if (response.success) {
          this.notificationService.success('Colaborador actualizado correctamente');
          this.goBack();
        }
      },
      error: () => this.submitting = false
    });
  }

  // =============================
  // Helpers UI
  // =============================
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => formGroup.get(key)?.markAsTouched());
  }

  getErrorMessage(fieldName: string): string {
    const control = this.colaboradorForm.get(fieldName);
    if (!control || !control.touched) return '';

    if (control.hasError('required')) return 'Este campo es obligatorio';
    if (control.hasError('minlength')) return `Debe tener al menos ${control.errors!['minlength'].requiredLength} caracteres`;
    if (control.hasError('pattern')) {
      if (fieldName === 'dni') return 'El DNI debe tener 8 dígitos';
      if (fieldName === 'telefono') return 'Teléfono inválido';
    }
    if (control.hasError('email')) return 'Correo no válido';
    if (control.hasError('dniExists')) return 'El DNI ya está registrado';
    if (control.hasError('emailExists')) return 'El correo ya está registrado';

    return '';
  }

  goBack(): void {
    this.router.navigate(['/admin/colaboradores']);
  }

  resetForm(): void {
    this.colaboradorForm.reset();
  }
}
