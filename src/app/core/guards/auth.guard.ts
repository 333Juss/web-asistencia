import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { NotificationService } from '../services/notification.service';

/**
 * Guard para verificar si el usuario está autenticado
 * Redirige al login si no hay token válido
 */
export const authGuard: CanActivateFn = (route, state) => {
    const storageService = inject(StorageService);
    const router = inject(Router);
    const notificationService = inject(NotificationService);

    const token = storageService.getToken();
    const currentUser = storageService.getCurrentUser();

    if (token && currentUser) {
        // Usuario autenticado
        return true;
    }

    // No autenticado - limpiar datos y redirigir
    storageService.clearAuthData();
    notificationService.warning('Debes iniciar sesión para acceder');
    router.navigate(['/auth/login'], {
        queryParams: { returnUrl: state.url }
    });

    return false;
};