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

    console.log('🛡️ AUTH GUARD - Verificando acceso a:', state.url);

    const token = storageService.getToken();
    const currentUser = storageService.getCurrentUser();

    console.log('🛡️ AUTH GUARD - Token:', token ? 'Existe' : 'No existe');
    console.log('🛡️ AUTH GUARD - Usuario:', currentUser);

    if (token && currentUser) {
        console.log('✅ AUTH GUARD - Acceso permitido');
        return true;
    }

    console.log('❌ AUTH GUARD - Acceso denegado, redirigiendo a login');
    storageService.clearAuthData();
    notificationService.warning('Debes iniciar sesión para acceder');
    router.navigate(['/auth/login'], {
        queryParams: { returnUrl: state.url }
    });

    return false;
};