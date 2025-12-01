import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmDialogData {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'info' | 'warning' | 'danger' | 'success';
    icon?: string;
}

@Component({
    selector: 'app-confirm-dialog',
    standalone: true,
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule
    ],
    templateUrl: './confirm-dialog.component.html',
    styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {

    constructor(
        public dialogRef: MatDialogRef<ConfirmDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
    ) {
        // Valores por defecto
        this.data.confirmText = this.data.confirmText || 'Confirmar';
        this.data.cancelText = this.data.cancelText || 'Cancelar';
        this.data.type = this.data.type || 'info';
        this.data.icon = this.data.icon || this.getDefaultIcon(this.data.type);
    }

    onConfirm(): void {
        this.dialogRef.close(true);
    }

    onCancel(): void {
        this.dialogRef.close(false);
    }

    private getDefaultIcon(type: string): string {
        const icons: { [key: string]: string } = {
            'info': 'info',
            'warning': 'warning',
            'danger': 'error',
            'success': 'check_circle'
        };
        return icons[type] || 'help';
    }

    getIconClass(): string {
        return `icon-${this.data.type}`;
    }
}