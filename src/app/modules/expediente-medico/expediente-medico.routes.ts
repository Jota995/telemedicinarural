import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path:':idHistorial',
        loadComponent:() => import('./pages/historial-medico/historial-medico.component').then(mod => mod.HistorialMedicoComponent)
    }
];
