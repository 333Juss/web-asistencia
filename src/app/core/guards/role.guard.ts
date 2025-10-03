import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { NotificationService } from '../services/notification.service';
import { RolUsuario, Usuario } from '../../components/models';


/**
 * Guard para verificar si el usuario tiene los roles necesarios
 * Se usa en conjunto con authGuard
 */
export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
    const storageService = inject(StorageService);
    const router = inject(Router);
    const notificationService = inject(NotificationService);

    const currentUser = storageService.getCurrentUser<Usuario>();

    if (!currentUser) {
        router.navigate(['/auth/login']);
        return false;
    }

    // Obtener roles requeridos de la configuración de la ruta
    const requiredRoles = route.data['roles'] as RolUsuario[];

    if (!requiredRoles || requiredRoles.length === 0) {
        // No hay roles específicos requeridos
        return true;
    }

    // Verificar si el usuario tiene alguno de los roles requeridos
    const hasRole = requiredRoles.includes(currentUser.rol);

    if (hasRole) {
        return true;
    }

    // No tiene los permisos necesarios
    notificationService.error('No tienes permisos para acceder a esta sección');
    router.navigate(['/']);
    return false;
};