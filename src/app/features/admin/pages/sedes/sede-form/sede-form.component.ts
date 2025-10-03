import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SedeService } from '../../../services/sede.service';
import { SedeMapComponent } from '../sede-map/sede-map.component';
import { Sede, SedeCreateDto, SedeUpdateDto, UbicacionSede } from '../../../../../components/models';
import { NotificationService } from '../../../../../core/services/notification.service';

@Component({
    selector: 'app-sede-form',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatSliderModule,
        MatProgressSpinnerModule,
        SedeMapComponent
    ],
    templateUrl: './sede-form.component.html',
    styleUrls: ['./sede-form.component.scss']
})
export class SedeFormComponent implements OnInit {

    sedeForm!: FormGroup;
    isEditMode = false;
    sedeId?: number;
    loading = false;
    submitting = false;

    ubicacion?: UbicacionSede;

    // Constantes de validación del radio
    readonly MIN_RADIO = 20;
    readonly MAX_RADIO = 200;
    readonly DEFAULT_RADIO = 50;

    constructor(
        private fb: FormBuilder,
        private sedeService: SedeService,
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
        this.sedeForm = this.fb.group({
            codigo: ['', [Validators.required, Validators.maxLength(50)]],
            nombre: ['', [Validators.required, Validators.maxLength(255)]],
            direccion: [''],
            distrito: [''],
            provincia: [''],
            departamento: [''],
            radioMetros: [this.DEFAULT_RADIO, [
                Validators.required,
                Validators.min(this.MIN_RADIO),
                Validators.max(this.MAX_RADIO)
            ]]
        });

        // Escuchar cambios en el radio
        this.sedeForm.get('radioMetros')?.valueChanges.subscribe(value => {
            if (this.ubicacion) {
                this.ubicacion = {
                    ...this.ubicacion,
                    radioMetros: value
                };
            }
        });
    }

    /**
     * Verifica si es modo edición
     */
    private checkEditMode(): void {
        this.sedeId = Number(this.route.snapshot.paramMap.get('id'));

        if (this.sedeId) {
            this.isEditMode = true;
            this.loadSede(this.sedeId);
        }
    }

    /**
     * Carga los datos de la sede en modo edición
     */
    private loadSede(id: number): void {
        this.loading = true;
        this.sedeService.getSedeById(id).subscribe({
            next: (response) => {
                if (response.success && response.data) {
                    this.populateForm(response.data);
                }
                this.loading = false;
            },
            error: () => {
                this.loading = false;
                this.notificationService.error('Error al cargar la sede');
                this.goBack();
            }
        });
    }

    /**
     * Llena el formulario con los datos de la sede
     */
    private populateForm(sede: Sede): void {
        this.sedeForm.patchValue({
            codigo: sede.codigo,
            nombre: sede.nombre,
            direccion: sede.direccion,
            distrito: sede.distrito,
            provincia: sede.provincia,
            departamento: sede.departamento,
            radioMetros: sede.radioMetros
        });

        // Establecer ubicación si existe
        if (sede.latitud && sede.longitud) {
            this.ubicacion = {
                latitud: sede.latitud,
                longitud: sede.longitud,
                radioMetros: sede.radioMetros
            };
        }
    }

    /**
     * Maneja el cambio de ubicación desde el mapa
     */
    onUbicacionChange(ubicacion: UbicacionSede): void {
        this.ubicacion = ubicacion;
        this.sedeForm.patchValue({ radioMetros: ubicacion.radioMetros });
    }

    /**
     * Envía el formulario
     */
    onSubmit(): void {
        if (this.sedeForm.invalid) {
            this.markFormGroupTouched(this.sedeForm);
            this.notificationService.warning('Por favor completa todos los campos requeridos');
            return;
        }

        if (!this.ubicacion) {
            this.notificationService.warning('Por favor selecciona una ubicación en el mapa');
            return;
        }

        // Validar radio
        const radio = this.sedeForm.value.radioMetros;
        if (!this.sedeService.validateRadio(radio)) {
            this.notificationService.error(`El radio debe estar entre ${this.MIN_RADIO} y ${this.MAX_RADIO} metros`);
            return;
        }

        this.submitting = true;

        if (this.isEditMode && this.sedeId) {
            this.updateSede();
        } else {
            this.createSede();
        }
    }

    /**
     * Crea una nueva sede
     */
    private createSede(): void {
        const dto: SedeCreateDto = {
            ...this.sedeForm.value,
            empresaId: 1, // Mock - debería venir del usuario autenticado
            latitud: this.ubicacion!.latitud,
            longitud: this.ubicacion!.longitud
        };

        this.sedeService.createSede(dto).subscribe({
            next: (response) => {
                this.submitting = false;
                if (response.success) {
                    this.notificationService.sedeConfigurada();
                    this.goBack();
                }
            },
            error: () => {
                this.submitting = false;
            }
        });
    }

    /**
     * Actualiza una sede existente
     */
    private updateSede(): void {
        const dto: SedeUpdateDto = {
            id: this.sedeId!,
            ...this.sedeForm.value,
            latitud: this.ubicacion!.latitud,
            longitud: this.ubicacion!.longitud
        };

        this.sedeService.updateSede(this.sedeId!, dto).subscribe({
            next: (response) => {
                this.submitting = false;
                if (response.success) {
                    this.notificationService.success('Sede actualizada correctamente');
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
        const control = this.sedeForm.get(fieldName);

        if (!control || !control.touched) {
            return '';
        }

        if (control.hasError('required')) {
            return 'Este campo es obligatorio';
        }

        if (control.hasError('maxlength')) {
            const maxLength = control.errors?.['maxlength'].requiredLength;
            return `Máximo ${maxLength} caracteres`;
        }

        if (control.hasError('min')) {
            return `El valor mínimo es ${this.MIN_RADIO}`;
        }

        if (control.hasError('max')) {
            return `El valor máximo es ${this.MAX_RADIO}`;
        }

        return '';
    }

    /**
     * Formatea el valor del slider
     */
    formatLabel(value: number): string {
        return `${value}m`;
    }

    /**
     * Vuelve a la lista de sedes
     */
    goBack(): void {
        this.router.navigate(['/admin/sedes']);
    }

    /**
     * Limpia el formulario
     */
    resetForm(): void {
        this.sedeForm.reset({
            radioMetros: this.DEFAULT_RADIO
        });
        this.ubicacion = undefined;
    }
}