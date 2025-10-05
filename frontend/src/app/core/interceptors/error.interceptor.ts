import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

export const errorInterceptorFn: HttpInterceptorFn = (req, next) => {
    const notificationService = inject(NotificationService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let errorMessage = 'Ocurrió un error inesperado';

            if (error.error instanceof ErrorEvent) {
                errorMessage = `Error: ${error.error.message}`;
            } else {
                switch (error.status) {
                    case 400:
                        errorMessage = error.error?.message || 'La solicitud contiene datos inválidos';
                        break;
                    case 401:
                        errorMessage = 'No tienes autorización. Por favor inicia sesión nuevamente.';
                        break;
                    case 403:
                        errorMessage = 'No tienes permisos para realizar esta acción.';
                        break;
                    case 404:
                        errorMessage = 'El recurso solicitado no fue encontrado.';
                        break;
                    case 409:
                        errorMessage = error.error?.message || 'El recurso ya existe';
                        break;
                    case 422:
                        errorMessage = error.error?.message || 'Error de validación';
                        break;
                    case 500:
                        errorMessage = 'Error interno del servidor. Por favor intenta más tarde.';
                        break;
                    default:
                        errorMessage = error.error?.message || errorMessage;
                }
            }

            if (error.status !== 401) {
                notificationService.error(errorMessage);
            }

            return throwError(() => error);
        })
    );
};