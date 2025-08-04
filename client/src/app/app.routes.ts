import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { Home } from './features/home/home';

export const routes: Routes = [
    {path: '', component: Home},
    {path: 'register', loadComponent: () => import('./features/auth/register/register')},
    {path: 'login', loadComponent: () => import('./features/auth/login/login')},
    {path: 'dashboard', canActivate: [authGuard], loadComponent: () => import('./features/dashboard/dashboard')},
];
