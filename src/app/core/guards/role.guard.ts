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

    console.log('🔐 ROLE GUARD - Verificando roles para:', state.url);

    const currentUser = storageService.getCurrentUser<Usuario>();
    console.log('🔐 ROLE GUARD - Usuario:', currentUser);

    if (!currentUser) {
        console.log('❌ ROLE GUARD - No hay usuario');
        router.navigate(['/auth/login']);
        return false;
    }

    const requiredRoles = route.data['roles'] as RolUsuario[];
    console.log('🔐 ROLE GUARD - Roles requeridos:', requiredRoles);
    console.log('🔐 ROLE GUARD - Rol del usuario:', currentUser.rol);

    if (!requiredRoles || requiredRoles.length === 0) {
        console.log('✅ ROLE GUARD - No hay roles requeridos');
        return true;
    }

    const hasRole = requiredRoles.includes(currentUser.rol);
    console.log('🔐 ROLE GUARD - ¿Tiene permiso?:', hasRole);

    if (hasRole) {
        console.log('✅ ROLE GUARD - Acceso permitido');
        return true;
    }

    console.log('❌ ROLE GUARD - Acceso denegado');
    notificationService.error('No tienes permisos para acceder a esta sección');
    router.navigate(['/']);
    return false;
};