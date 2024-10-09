import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path:'home',
        loadComponent: () => import('./pages/home/home.component').then(mod => mod.HomeComponent)
    },
    {
        path:'historial-medico',
        loadComponent: () => import('./pages/historial-medico/historial-medico.component').then(mod => mod.HistorialMedicoComponent)
    }
];
