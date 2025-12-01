import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    private defaultDuration = 3000;
    private horizontalPosition: MatSnackBarHorizontalPosition = 'end';
    private verticalPosition: MatSnackBarVerticalPosition = 'top';

    constructor(private snackBar: MatSnackBar) { }

    /**
     * Muestra una notificación de éxito
     * @param message Mensaje a mostrar
     * @param duration Duración en milisegundos (default: 3000)
     */
    success(message: string, duration: number = this.defaultDuration): void {
        this.show(message, 'success-snackbar', duration);
    }

    /**
     * Muestra una notificación de error
     * @param message Mensaje a mostrar
     * @param duration Duración en milisegundos (default: 5000)
     */
    error(message: string, duration: number = 5000): void {
        this.show(message, 'error-snackbar', duration);
    }

    /**
     * Muestra una notificación de advertencia
     * @param message Mensaje a mostrar
     * @param duration Duración en milisegundos (default: 4000)
     */
    warning(message: string, duration: number = 4000): void {
        this.show(message, 'warning-snackbar', duration);
    }

    /**
     * Muestra una notificación de información
     * @param message Mensaje a mostrar
     * @param duration Duración en milisegundos (default: 3000)
     */
    info(message: string, duration: number = this.defaultDuration): void {
        this.show(message, 'info-snackbar', duration);
    }

    /**
     * Muestra una notificación genérica
     * @param message Mensaje a mostrar
     * @param panelClass Clase CSS para personalizar
     * @param duration Duración en milisegundos
     */
    private show(message: string, panelClass: string, duration: number): void {
        const config: MatSnackBarConfig = {
            duration: duration,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
            panelClass: [panelClass]
        };

        this.snackBar.open(message, 'Cerrar', config);
    }

    /**
     * Muestra una notificación con acción personalizada
     * @param message Mensaje a mostrar
     * @param action Texto del botón de acción
     * @param callback Función a ejecutar al hacer clic en la acción
     * @param duration Duración en milisegundos
     */
    showWithAction(
        message: string,
        action: string,
        callback: () => void,
        duration: number = this.defaultDuration
    ): void {
        const config: MatSnackBarConfig = {
            duration: duration,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition
        };

        const snackBarRef = this.snackBar.open(message, action, config);

        snackBarRef.onAction().subscribe(() => {
            callback();
        });
    }

    /**
     * Muestra una notificación persistente (sin duración)
     * @param message Mensaje a mostrar
     * @param panelClass Clase CSS para personalizar
     */
    showPersistent(message: string, panelClass?: string): void {
        const config: MatSnackBarConfig = {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
            panelClass: panelClass ? [panelClass] : undefined
        };

        this.snackBar.open(message, 'Cerrar', config);
    }

    /**
     * Cierra todas las notificaciones abiertas
     */
    dismiss(): void {
        this.snackBar.dismiss();
    }

    /**
     * Configura la posición global de las notificaciones
     * @param horizontal Posición horizontal
     * @param vertical Posición vertical
     */
    setPosition(
        horizontal: MatSnackBarHorizontalPosition,
        vertical: MatSnackBarVerticalPosition
    ): void {
        this.horizontalPosition = horizontal;
        this.verticalPosition = vertical;
    }

    // ==================== MENSAJES PREDEFINIDOS DEL SISTEMA ====================

    // Mensajes de éxito
    colaboradorRegistrado(): void {
        this.success('Colaborador registrado correctamente');
    }

    sedeConfigurada(): void {
        this.success('Sede configurada correctamente');
    }

    rostroRegistrado(): void {
        this.success('Rostro registrado exitosamente');
    }

    entradaRegistrada(): void {
        this.success('Entrada registrada correctamente');
    }

    salidaRegistrada(horas: number): void {
        this.success(`Salida registrada. Trabajaste ${horas.toFixed(2)} horas`);
    }

    // Mensajes de error
    dniDuplicado(): void {
        this.error('Este DNI ya está registrado');
    }

    emailDuplicado(): void {
        this.error('Este correo electrónico ya está registrado');
    }

    fueraDeZona(): void {
        this.error('Debes estar dentro del perímetro de la tienda');
    }

    sinEntradaPrevia(): void {
        this.error('No tienes entrada registrada');
    }

    rostroNoDetectado(): void {
        this.error('No se detectó ningún rostro en la imagen');
    }

    malaIluminacion(): void {
        this.warning('Por favor mejora la iluminación');
    }

    bajaConfianza(): void {
        this.error('No se pudo verificar tu identidad con suficiente confianza');
    }

    errorGenerico(): void {
        this.error('Ocurrió un error. Por favor intenta nuevamente.');
    }

    // Mensajes de información
    procesandoImagen(): void {
        this.info('Procesando imagen...', 2000);
    }

    verificandoUbicacion(): void {
        this.info('Verificando ubicación...', 2000);
    }
}