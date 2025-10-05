import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Usuario } from '../../models';
import { AuthService } from '../../../core/services/auth.service';

interface MenuItem {
    label: string;
    icon: string;
    route: string;
    roles: string[];
    badge?: number;
}

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        MatListModule,
        MatIconModule,
        MatDividerModule
    ],
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
    @Output() closeSidebar = new EventEmitter<void>();

    currentUser$: Observable<Usuario | null>;

    menuItems: MenuItem[] = [
        // Empleado
        {
            label: 'Marcar Asistencia',
            icon: 'fingerprint',
            route: '/employee/marcar-asistencia',
            roles: ['EMPLEADO', 'ADMIN']
        },
        {
            label: 'Mis Asistencias',
            icon: 'history',
            route: '/employee/mis-asistencias',
            roles: ['EMPLEADO', 'ADMIN']
        },
        {
            label: 'Registro Biométrico',
            icon: 'face',
            route: '/employee/registro-biometrico',
            roles: ['EMPLEADO', 'ADMIN']
        },

        // Admin
        {
            label: 'Dashboard',
            icon: 'dashboard',
            route: '/admin/dashboard',
            roles: ['ADMIN', 'RRHH']
        },
        {
            label: 'Colaboradores',
            icon: 'people',
            route: '/admin/colaboradores',
            roles: ['ADMIN', 'RRHH']
        },
        {
            label: 'Sedes',
            icon: 'store',
            route: '/admin/sedes',
            roles: ['ADMIN', 'RRHH']
        },
        {
            label: 'Reportes',
            icon: 'assessment',
            route: '/reports',
            roles: ['ADMIN', 'RRHH', 'SUPERVISOR']
        },
        {
            label: 'Configuración',
            icon: 'settings',
            route: '/admin/configuracion',
            roles: ['ADMIN']
        }
    ];

    constructor(private authService: AuthService) {
        this.currentUser$ = this.authService.currentUser$;
    }

    getFilteredMenuItems(user: Usuario | null): MenuItem[] {
        if (!user) return [];
        return this.menuItems.filter(item => item.roles.includes(user.rol));
    }

    onMenuItemClick(): void {
        this.closeSidebar.emit();
    }
}