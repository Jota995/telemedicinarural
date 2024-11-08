import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path:'resumen',
        loadComponent:() => import('./pages/resumen-citas/resumen-citas.component').then(mod => mod.ResumenCitasComponent)
    },
    {
        path:'periodo/:periodo',
        loadComponent: () => import('./pages/resumen-citas/resumen-citas.component').then(mod => mod.ResumenCitasComponent)
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
