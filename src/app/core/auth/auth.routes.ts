import { Routes } from '@angular/router';
import { sessionGuard } from './guards/session.guard';
import { AuthService } from './services/auth.service';

export const routes: Routes = [
    {
        path:'',
        children:[
            {
                path:'login',
                loadComponent:() => import('./pages/login/login.component').then(mod => mod.LoginComponent)
            },
            {
                path:'register',
                loadComponent: () => import('./pages/register/register.component').then(mod => mod.RegisterComponent)
            },
            
        ]
    }
];
