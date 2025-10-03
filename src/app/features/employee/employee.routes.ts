import { Routes } from '@angular/router';
import { RegistroBiometricoComponent } from './pages/registro-biometrico/registro-biometrico.component';
import { MarcarAsistenciaComponent } from './pages/marca-asistencia/marcar-asistencia.component';


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
    }
];