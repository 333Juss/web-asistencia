import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../components/confirm-dialog/confirm-dialog.component';

@Injectable({
    providedIn: 'root'
})
export class ConfirmDialogService {

    constructor(private dialog: MatDialog) { }

    /**
     * Abre un diálogo de confirmación
     */
    open(data: ConfirmDialogData): Observable<boolean> {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '400px',
            data: data,
            disableClose: true
        });

        return dialogRef.afterClosed();
    }

    /**
     * Diálogo de confirmación de eliminación
     */
    confirmDelete(itemName: string): Observable<boolean> {
        return this.open({
            title: 'Confirmar eliminación',
            message: `¿Estás seguro de que deseas eliminar "${itemName}"? Esta acción no se puede deshacer.`,
            confirmText: 'Eliminar',
            cancelText: 'Cancelar',
            type: 'danger',
            icon: 'delete'
        });
    }

    /**
     * Diálogo de confirmación genérico
     */
    confirm(title: string, message: string): Observable<boolean> {
        return this.open({
            title: title,
            message: message,
            confirmText: 'Aceptar',
            cancelText: 'Cancelar',
            type: 'warning'
        });
    }
}