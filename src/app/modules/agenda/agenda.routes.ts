import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path:'',
        children:[
            {
                path:'resumen',
                loadComponent:() => import('./pages/agenda/agenda.component').then(mod => mod.AgendaComponent)
            },
            {
                path:'agendar-cita',
                loadComponent: () => import('./pages/agendar-cita/agendar-cita.component').then(mod => mod.AgendarCitaComponent)
            }
        ]
    }
];
