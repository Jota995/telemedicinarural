import { Routes } from '@angular/router';
import { authGuard } from './core/auth/guards/auth.guard';

export const routes: Routes = [
    {
        path:'app',
        loadComponent: () => import('./core/layouts/app-layout/app-layout.component').then(m => m.AppLayoutComponent),
        canActivate:[authGuard],
        children:[
            {
                path:'home',
                loadComponent:() => import('./core/pages/home/home.component').then(mod => mod.HomeComponent)
            },
            {
                path:'agenda',
                loadChildren: () => import('./modules/agenda/agenda.routes').then(mod => mod.routes)
            }
        ],
    },
    {
        path:'auth',
        loadChildren: () => import('./core/auth/auth.routes').then(m => m.routes)
    },
    {
        path:'**',
        redirectTo:'/app/home'
    }
];
