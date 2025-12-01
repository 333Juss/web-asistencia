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
    {
        path: 'auth',
        loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
    },
    {
        path: 'admin',
        component: MainLayoutComponent,
        canActivate: [authGuard, roleGuard],
        data: { roles: ['ADMIN', 'RRHH', 'SUPERVISOR'] },
        loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
    },
    {
        path: 'employee',
        component: MainLayoutComponent,
        canActivate: [authGuard, roleGuard],
        data: { roles: ['EMPLEADO', 'ADMIN', 'RRHH'] },
        loadChildren: () => import('./features/employee/employee.routes').then(m => m.EMPLOYEE_ROUTES)
    },
    {
        path: 'profile',
        component: MainLayoutComponent,
        canActivate: [authGuard],
        children: [
            {
                path: '',
                loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent)
            }
        ]
    },
    {
        path: 'settings',
        component: MainLayoutComponent,
        canActivate: [authGuard],
        children: [
            {
                path: '',
                loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent)
            }
        ]
    },
    {
        path: '**',
        redirectTo: '/auth/login'
    }
];