import { Routes } from '@angular/router';
import { ColaboradorListComponent } from './pages/colaboradores/colaborador-list/colaborador-list.component';
import { ColaboradorFormComponent } from './pages/colaboradores/colaborador-form/colaborador-form.component';
import { ColaboradorDetailComponent } from './pages/colaboradores/colaborador-detail/colaborador-detail.component';
import { SedeListComponent } from './pages/sedes/sede-list/sede-list.component';
import { SedeFormComponent } from './pages/sedes/sede-form/sede-form.component';
import { SedeDetailComponent } from './pages/sedes/sede-detail/sede-detail.component';
import { ReportesComponent } from './pages/reportes/reportes.component';
import { ConfiguracionComponent } from './pages/configuracion/configuracion.component';

import { Dashboard } from './pages/dashboard/dashboard';
import {TurnoListComponent} from './pages/turnos/turno-list/turno-list.component';
import {TurnoFormComponent} from './pages/turnos/turno-form/turno-form.component';
import {TurnoDetailComponent} from './pages/turnos/turno-detail/turno-detail.component';

export const ADMIN_ROUTES: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: 'dashboard',
        component: Dashboard
    },
    {
        path: 'colaboradores',
        children: [
            { path: '', component: ColaboradorListComponent },
            { path: 'nuevo', component: ColaboradorFormComponent },
            { path: 'editar/:id', component: ColaboradorFormComponent },
            { path: ':id', component: ColaboradorDetailComponent }
        ]
    },
    {
      path: 'turnos',
      children: [
        { path: '', component: TurnoListComponent },
        { path: 'nuevo', component: TurnoFormComponent },
        { path: 'editar/:id', component: TurnoFormComponent },
        { path: ':id', component: TurnoDetailComponent }
      ]
    },
    {
        path: 'sedes',
        children: [
            { path: '', component: SedeListComponent },
            { path: 'nueva', component: SedeFormComponent },
            { path: 'editar/:id', component: SedeFormComponent },
            { path: ':id', component: SedeDetailComponent }
        ]
    },
    {
      path: 'justificaciones',
      loadComponent: () =>
        import('./pages/justificaciones/justificaciones-admin.component')
          .then(m => m.JustificacionesAdminComponent)
    },
  {
        path: 'debug',
        component: ReportesComponent
    },
    {
        path: 'reportes',
        component: ReportesComponent
    },
    {
        path: 'configuracion',
        component: ConfiguracionComponent
    }
];
