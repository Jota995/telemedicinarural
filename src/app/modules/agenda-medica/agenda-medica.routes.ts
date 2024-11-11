import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path:'',
        loadComponent: () => import('./pages/resumen-agenda-medica/resumen-agenda-medica.component').then(m => m.ResumenAgendaMedicaComponent)
    }
];
