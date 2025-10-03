import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ColaboradorService } from '../../../services/colaborador.service';
import { Observable, of } from 'rxjs';
import { map, catchError, debounceTime, switchMap } from 'rxjs/operators';
import { Colaborador, ColaboradorCreateDto, ColaboradorUpdateDto, Sede } from '../../../../../components/models';
import { NotificationService } from '../../../../../core/services/notification.service';

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
        MatProgressSpinnerModule
    ],
    templateUrl: './colaborador-form.component.html',
    styleUrls: ['./colaborador-form.component.scss']
})
export class ColaboradorFormComponent implements OnInit {

    colaboradorForm!: FormGroup;
    isEditMode = false;
    colaboradorId?: number;
    loading = false;
    submitting = false;

    // Mock data - En producción vendría del backend
    sedes: Sede[] = [
        { id: 1, empresaId: 1, codigo: 'SB', nombre: 'San Borja', radioMetros: 50, activo: true },
        { id: 2, empresaId: 1, codigo: 'LC', nombre: 'Lince', radioMetros: 50, activo: true }
    ];

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
        private notificationService: NotificationService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.initForm();
        this.checkEditMode();
    }

    /**
     * Inicializa el formulario
     */
    private initForm(): void {
        this.colaboradorForm = this.fb.group({
            dni: ['',
                [Validators.required, Validators.pattern(/^\d{8}$/)],
                [this.dniAsyncValidator.bind(this)]
            ],
            nombres: ['', [Validators.required, Validators.minLength(2)]],
            apellidos: ['', [Validators.required, Validators.minLength(2)]],
            email: ['',
                [Validators.required, Validators.email],
                [this.emailAsyncValidator.bind(this)]
            ],
            telefono: ['', [Validators.pattern(/^\d{9}$/)]],
            fechaNacimiento: [''],
            fechaIngreso: ['', Validators.required],
            cargo: [''],
            sedeId: ['', Validators.required]
        });
    }

    /**
     * Verifica si es modo edición
     */
    private checkEditMode(): void {
        this.colaboradorId = Number(this.route.snapshot.paramMap.get('id'));

        if (this.colaboradorId) {
            this.isEditMode = true;
            this.loadColaborador(this.colaboradorId);
        }
    }

    /**
     * Carga los datos del colaborador en modo edición
     */
    private loadColaborador(id: number): void {
        this.loading = true;
        this.colaboradorService.getColaboradorById(id).subscribe({
            next: (response) => {
                if (response.success && response.data) {
                    this.populateForm(response.data);
                }
                this.loading = false;
            },
            error: () => {
                this.loading = false;
                this.notificationService.error('Error al cargar el colaborador');
                this.goBack();
            }
        });
    }

    /**
     * Llena el formulario con los datos del colaborador
     */
    private populateForm(colaborador: Colaborador): void {
        this.colaboradorForm.patchValue({
            dni: colaborador.dni,
            nombres: colaborador.nombres,
            apellidos: colaborador.apellidos,
            email: colaborador.email,
            telefono: colaborador.telefono,
            fechaNacimiento: colaborador.fechaNacimiento,
            fechaIngreso: colaborador.fechaIngreso,
            cargo: colaborador.cargo,
            sedeId: colaborador.sedeId
        });
    }

    /**
     * Validador asíncrono para DNI único
     */
    private dniAsyncValidator(control: AbstractControl): Observable<ValidationErrors | null> {
        if (!control.value || control.value.length !== 8) {
            return of(null);
        }

        return control.valueChanges.pipe(
            debounceTime(500),
            switchMap(() =>
                this.colaboradorService.checkDniExists(control.value, this.colaboradorId)
            ),
            map(response => {
                return response.data?.exists ? { dniExists: true } : null;
            }),
            catchError(() => of(null))
        );
    }

    /**
     * Validador asíncrono para email único
     */
    private emailAsyncValidator(control: AbstractControl): Observable<ValidationErrors | null> {
        if (!control.value || !control.value.includes('@')) {
            return of(null);
        }

        return control.valueChanges.pipe(
            debounceTime(500),
            switchMap(() =>
                this.colaboradorService.checkEmailExists(control.value, this.colaboradorId)
            ),
            map(response => {
                return response.data?.exists ? { emailExists: true } : null;
            }),
            catchError(() => of(null))
        );
    }

    /**
     * Envía el formulario
     */
    onSubmit(): void {
        if (this.colaboradorForm.invalid) {
            this.markFormGroupTouched(this.colaboradorForm);
            this.notificationService.warning('Por favor completa todos los campos requeridos');
            return;
        }

        this.submitting = true;

        if (this.isEditMode && this.colaboradorId) {
            this.updateColaborador();
        } else {
            this.createColaborador();
        }
    }

    /**
     * Crea un nuevo colaborador
     */
    private createColaborador(): void {
        const dto: ColaboradorCreateDto = {
            ...this.colaboradorForm.value,
            empresaId: 1 // Mock - debería venir del usuario autenticado
        };

        this.colaboradorService.createColaborador(dto).subscribe({
            next: (response) => {
                this.submitting = false;
                if (response.success) {
                    this.notificationService.colaboradorRegistrado();
                    this.goBack();
                }
            },
            error: () => {
                this.submitting = false;
            }
        });
    }

    /**
     * Actualiza un colaborador existente
     */
    private updateColaborador(): void {
        const dto: ColaboradorUpdateDto = {
            id: this.colaboradorId!,
            ...this.colaboradorForm.value
        };

        this.colaboradorService.updateColaborador(this.colaboradorId!, dto).subscribe({
            next: (response) => {
                this.submitting = false;
                if (response.success) {
                    this.notificationService.success('Colaborador actualizado correctamente');
                    this.goBack();
                }
            },
            error: () => {
                this.submitting = false;
            }
        });
    }

    /**
     * Marca todos los campos del formulario como touched
     */
    private markFormGroupTouched(formGroup: FormGroup): void {
        Object.keys(formGroup.controls).forEach(key => {
            const control = formGroup.get(key);
            control?.markAsTouched();
        });
    }

    /**
     * Obtiene el mensaje de error de un campo
     */
    getErrorMessage(fieldName: string): string {
        const control = this.colaboradorForm.get(fieldName);

        if (!control || !control.touched) {
            return '';
        }

        if (control.hasError('required')) {
            return 'Este campo es obligatorio';
        }

        if (control.hasError('minlength')) {
            const minLength = control.errors?.['minlength'].requiredLength;
            return `Mínimo ${minLength} caracteres`;
        }

        if (control.hasError('pattern')) {
            if (fieldName === 'dni') {
                return 'El DNI debe tener 8 dígitos';
            }
            if (fieldName === 'telefono') {
                return 'El teléfono debe tener 9 dígitos';
            }
        }

        if (control.hasError('email')) {
            return 'Correo electrónico no válido';
        }

        if (control.hasError('dniExists')) {
            return 'Este DNI ya está registrado';
        }

        if (control.hasError('emailExists')) {
            return 'Este correo electrónico ya está registrado';
        }

        return '';
    }

    /**
     * Vuelve a la lista de colaboradores
     */
    goBack(): void {
        this.router.navigate(['/admin/colaboradores']);
    }

    /**
     * Limpia el formulario
     */
    resetForm(): void {
        this.colaboradorForm.reset();
    }
}