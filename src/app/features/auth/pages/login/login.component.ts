import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { LoginDto } from '../../../../components/models';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatCheckboxModule
    ],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    loginForm!: FormGroup;
    hidePassword = true;
    loading = false;
    returnUrl: string = '/';

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private notificationService: NotificationService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.initForm();

        // Obtener URL de retorno si existe
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    /**
     * Inicializa el formulario
     */
    private initForm(): void {
        this.loginForm = this.fb.group({
            username: ['', [Validators.required, Validators.minLength(3)]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            rememberMe: [false]
        });
    }

    /**
     * Envía el formulario de login
     */
    onSubmit(): void {
        if (this.loginForm.invalid) {
            this.markFormGroupTouched(this.loginForm);
            return;
        }

        this.loading = true;
        const credentials: LoginDto = {
            username: this.loginForm.value.username,
            password: this.loginForm.value.password
        };

        this.authService.login(credentials).subscribe({
            next: (response) => {
                if (response.success) {
                    // El servicio ya maneja la redirección por rol
                    // Si hay returnUrl, navegar a esa URL en su lugar
                    if (this.returnUrl !== '/') {
                        this.router.navigateByUrl(this.returnUrl);
                    }
                }
                this.loading = false;
            },
            error: (error) => {
                this.loading = false;
                console.error('Error en login:', error);
                // El ErrorInterceptor ya muestra el error
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
        const control = this.loginForm.get(fieldName);

        if (control?.hasError('required')) {
            return 'Este campo es obligatorio';
        }

        if (control?.hasError('minlength')) {
            const minLength = control.errors?.['minlength'].requiredLength;
            return `Mínimo ${minLength} caracteres`;
        }

        return '';
    }

    /**
     * Navega a la página de registro
     */
    goToRegister(): void {
        this.router.navigate(['/auth/register']);
    }

    /**
     * Navega a recuperar contraseña
     */
    goToForgotPassword(): void {
        this.router.navigate(['/auth/forgot-password']);
    }
}