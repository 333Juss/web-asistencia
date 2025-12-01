import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { Observable } from 'rxjs';
import { Colaborador, Usuario } from '../../models';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatBadgeModule,
        MatDividerModule
    ],
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
    @Output() toggleSidebar = new EventEmitter<void>();

    currentUser$: Observable<Usuario | null>;
    currentColaborador$: Observable<Colaborador | null>;

    constructor(private authService: AuthService) {
        this.currentUser$ = this.authService.currentUser$;
        this.currentColaborador$ = this.authService.currentColaborador$;
    }

    onToggleSidebar(): void {
        this.toggleSidebar.emit();
    }

    logout(): void {
        this.authService.logout();
    }

    getNombreCompleto(colaborador: Colaborador | null): string {
        if (!colaborador) return 'Usuario';
        return `${colaborador.nombres} ${colaborador.apellidos}`;
    }

    getRolLabel(rol: string): string {
        const roles: { [key: string]: string } = {
            'ADMIN': 'Administrador',
            'RRHH': 'Recursos Humanos',
            'EMPLEADO': 'Empleado',
            'SUPERVISOR': 'Supervisor'
        };
        return roles[rol] || rol;
    }
}