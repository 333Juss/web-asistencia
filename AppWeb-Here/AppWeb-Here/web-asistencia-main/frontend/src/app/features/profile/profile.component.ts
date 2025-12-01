import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../core/services/auth.service';
import { Colaborador, Usuario } from '../../components/models';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatDividerModule
    ],
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
    user$: Observable<Usuario | null>;
    colaborador$: Observable<Colaborador | null>;

    constructor(private authService: AuthService) {
        this.user$ = this.authService.currentUser$;
        this.colaborador$ = this.authService.currentColaborador$;
    }

    ngOnInit(): void {
    }

    getRolLabel(rol: string): string {
        switch (rol) {
            case 'ADMIN': return 'Administrador';
            case 'RRHH': return 'Recursos Humanos';
            case 'SUPERVISOR': return 'Supervisor';
            case 'EMPLEADO': return 'Empleado';
            default: return rol;
        }
    }
}
