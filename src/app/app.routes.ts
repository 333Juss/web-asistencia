import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { MainLayoutComponent } from './components/layout/main-layout/main-layout.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/auth/login',
        pathMatch: 'full'
    },
    // Rutas públicas (sin autenticación)
    {
        path: 'auth',
        loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
    },
    // Rutas protegidas (con autenticación)
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [authGuard],
        children: [
            {
                path: 'admin',
                canActivate: [roleGuard],
                data: { roles: ['ADMIN', 'RRHH'] },
                loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
            },
            {
                path: 'employee',
                canActivate: [roleGuard],
                data: { roles: ['EMPLOYEE'] },
                loadChildren: () => import('./features/employee/employee.routes').then(m => m.EMPLOYEE_ROUTES)
            }
        ]
    },
    // Ruta wildcard al final
    {
        path: '**',
        redirectTo: '/auth/login'
    }
];