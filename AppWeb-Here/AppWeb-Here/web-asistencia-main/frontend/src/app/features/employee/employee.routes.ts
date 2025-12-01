import { Routes } from '@angular/router';
import { RegistroBiometricoComponent } from './pages/registro-biometrico/registro-biometrico.component';
import { MarcarAsistenciaComponent } from './pages/marca-asistencia/marcar-asistencia.component';
import { MisAsistenciasComponent } from './pages/mis-asistencias/mis-asistencias.component';
import {authGuard} from '../../core/guards/auth.guard';
import {roleGuard} from '../../core/guards/role.guard';


export const EMPLOYEE_ROUTES: Routes = [
    {
        path: '',
        redirectTo: 'marcar-asistencia',
        pathMatch: 'full'
    },
    {
        path: 'marcar-asistencia',
        component: MarcarAsistenciaComponent
    },
    {
        path: 'registro-biometrico',
        component: RegistroBiometricoComponent
    },
    {
        path: 'mis-asistencias',
        component: MisAsistenciasComponent
    },
  {
    path: 'asistencias/inasistencias',
    loadComponent: () =>
      import('./pages/inasistencias/inasistencias.component')
        .then(m => m.InasistenciasComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['EMPLEADO'] }
  }



];
