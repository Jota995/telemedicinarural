import { Routes } from '@angular/router';
import { authGuard } from './core/auth/guards/auth.guard';
import { AuthService } from './core/auth/services/auth.service';
import { AppLayoutComponent } from './core/layouts/app-layout/app-layout.component';
import { sessionGuard } from './core/auth/guards/session.guard';

export const routes: Routes = [
    {
        path:'app',
        component: AppLayoutComponent,
        canActivate:[authGuard],
        providers:[AuthService],
        children:[
            {
                path:'home',
                loadComponent:() => import('./core/pages/home/home.component').then(mod => mod.HomeComponent)
            },
            {
                path:'citas-medicas',
                loadChildren: () => import('./modules/citas-medicas/citas-medicas.routes').then(mod => mod.routes)
            },
            {
                path:'historial-medico',
                loadChildren: () => import('./modules/expediente-medico/expediente-medico.routes').then(m => m.routes)
            }
        ],
    },
    {
        path:'auth',
        canActivate:[sessionGuard],
        providers:[AuthService],
        loadChildren: () => import('./core/auth/auth.routes').then(m => m.routes)
    },
    {
        path:'',
        redirectTo:'/app/agenda/resumen',
        pathMatch:'full'
    },
    {
        path:'**',
        redirectTo:'/app/agenda/resumen'
    }
];
