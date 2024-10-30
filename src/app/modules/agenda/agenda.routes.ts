import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path:'resumen',
        loadComponent:() => import('./pages/agenda/agenda.component').then(mod => mod.AgendaComponent)
    },
    {
        path:'periodo/:periodo',
        loadComponent: () => import('./pages/agenda-resumen-periodo/agenda-resumen-periodo.component').then(mod => mod.AgendaResumenPeriodoComponent)
    },
    {
        path:'agendar-cita',
        loadComponent: () => import('./pages/agendar-cita/agendar-cita.component').then(mod => mod.AgendarCitaComponent)
    },
    {
        path:'',
        redirectTo:'/app/agenda/resumen',
        pathMatch:'full'
    }
];
