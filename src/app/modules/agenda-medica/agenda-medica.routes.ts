import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path:'',
        loadComponent: () => import('./pages/resumen-agenda-medica/resumen-agenda-medica.component').then(m => m.ResumenAgendaMedicaComponent)
    },
    {
        path:'registrar',
        loadComponent: () => import('./pages/registrar-agenda-medica/registrar-agenda-medica.component').then(m => m.RegistrarAgendaMedicaComponent)
    }
];
