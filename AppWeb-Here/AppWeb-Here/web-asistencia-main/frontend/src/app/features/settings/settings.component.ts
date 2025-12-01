import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
    selector: 'app-settings',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule
    ],
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
    passwordForm: FormGroup;
    loading = false;
    hideOld = true;
    hideNew = true;
    hideConfirm = true;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private notificationService: NotificationService
    ) {
        this.passwordForm = this.fb.group({
            oldPassword: ['', Validators.required],
            newPassword: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required]
        }, { validator: this.passwordMatchValidator });
    }

    passwordMatchValidator(g: FormGroup) {
        return g.get('newPassword')?.value === g.get('confirmPassword')?.value
            ? null : { mismatch: true };
    }

    onSubmit() {
        if (this.passwordForm.valid) {
            this.loading = true;
            const { oldPassword, newPassword } = this.passwordForm.value;

            this.authService.changePassword(oldPassword, newPassword).subscribe({
                next: (response) => {
                    if (response.success) {
                        this.passwordForm.reset();
                        // Opcional: Cerrar sesión para obligar a re-ingresar
                    }
                    this.loading = false;
                },
                error: () => {
                    this.loading = false;
                }
            });
        }
    }
}
