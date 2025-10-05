import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatStepperModule
    ],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

    empresaForm!: FormGroup;
    contactoForm!: FormGroup;
    negocioForm!: FormGroup;
    loading = false;

    constructor(
        private fb: FormBuilder,
        private notificationService: NotificationService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.initForms();
    }

    private initForms(): void {
        this.empresaForm = this.fb.group({
            nombreComercial: ['', Validators.required]
        });

        this.contactoForm = this.fb.group({
            ruc: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
            razonSocial: ['', Validators.required],
            direccion: [''],
            ciudad: [''],
            departamento: [''],
            codigoPostal: [''],
            telefono: ['']
        });

        this.negocioForm = this.fb.group({
            categoria: [''],
            descripcion: [''],
            cantidadEmpleados: ['', [Validators.min(1)]]
        });
    }

    onSubmit(): void {
        if (this.empresaForm.invalid || this.contactoForm.invalid || this.negocioForm.invalid) {
            this.notificationService.warning('Por favor completa todos los campos requeridos');
            return;
        }

        // Aquí iría la lógica de registro
        this.notificationService.success('Registro completado');
        this.router.navigate(['/auth/login']);
    }

    goBack(): void {
        this.router.navigate(['/auth/login']);
    }
}