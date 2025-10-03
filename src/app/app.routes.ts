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
                loadChildren: () => import('./features/employee/employee.routes').then(m => m.EMPLOYEE_ROUTES)
            },
        ]
    },
    {
        path: '**',
        redirectTo: '/auth/login'
    }
];