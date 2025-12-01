import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfiguracionService, Configuracion } from '../../services/configuracion.service';

@Component({
    selector: 'app-configuracion',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatSnackBarModule
    ],
    templateUrl: './configuracion.component.html',
    styleUrls: ['./configuracion.component.scss']
})
export class ConfiguracionComponent implements OnInit {
    configForm: FormGroup;
    loading = false;

    constructor(
        private fb: FormBuilder,
        private configuracionService: ConfiguracionService,
        private snackBar: MatSnackBar
    ) {
        this.configForm = this.fb.group({
            nombreEmpresa: ['', Validators.required],
            ruc: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
            direccion: [''],
            horaEntradaDefault: ['', Validators.required],
            horaSalidaDefault: ['', Validators.required],
            toleranciaMinutos: [15, [Validators.required, Validators.min(0)]],
            nivelConfianzaBiometrica: [0.70, [Validators.required, Validators.min(0), Validators.max(1)]]
        });
    }

    ngOnInit() {
        this.loadConfiguracion();
    }

    loadConfiguracion() {
        this.loading = true;
        this.configuracionService.getConfiguracion().subscribe({
            next: (response) => {
                if (response.success && response.data) {
                    this.configForm.patchValue(response.data);
                }
                this.loading = false;
            },
            error: (err) => {
                console.error('Error loading configuration', err);
                this.showSnackBar('Error al cargar la configuración', 'error');
                this.loading = false;
            }
        });
    }

    onSubmit() {
        if (this.configForm.valid) {
            this.loading = true;
            const config: Configuracion = this.configForm.value;

            this.configuracionService.updateConfiguracion(config).subscribe({
                next: (response) => {
                    if (response.success) {
                        this.showSnackBar('Configuración actualizada correctamente', 'success');
                    }
                    this.loading = false;
                },
                error: (err) => {
                    console.error('Error updating configuration', err);
                    this.showSnackBar('Error al actualizar la configuración', 'error');
                    this.loading = false;
                }
            });
        }
    }

    private showSnackBar(message: string, type: 'success' | 'error') {
        this.snackBar.open(message, 'Cerrar', {
            duration: 3000,
            panelClass: type === 'error' ? ['error-snackbar'] : ['success-snackbar']
        });
    }
}
