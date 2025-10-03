import { Routes } from '@angular/router';
import { ColaboradorListComponent } from './pages/colaboradores/colaborador-list/colaborador-list.component';
import { ColaboradorFormComponent } from './pages/colaboradores/colaborador-form/colaborador-form.component';
import { ColaboradorDetailComponent } from './pages/colaboradores/colaborador-detail/colaborador-detail.component';
import { SedeListComponent } from './pages/sedes/sede-list/sede-list.component';
import { SedeFormComponent } from './pages/sedes/sede-form/sede-form.component';

export const ADMIN_ROUTES: Routes = [
    {
        path: '',
        redirectTo: 'colaboradores',
        pathMatch: 'full'
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
        path: 'sedes',
        children: [
            { path: '', component: SedeListComponent },
            { path: 'nueva', component: SedeFormComponent },
            { path: 'editar/:id', component: SedeFormComponent }
        ]
    }
];