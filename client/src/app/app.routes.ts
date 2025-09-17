import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { authGuard, nonAuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {path: '', canActivate: [nonAuthGuard],component: Home},
    {path: 'register', canActivate: [nonAuthGuard],loadComponent: () => import('./features/auth/register/register')},
    {path: 'login', canActivate: [nonAuthGuard],loadComponent: () => import('./features/auth/login/login')},
    {path: 'dashboard', canActivate: [authGuard], loadComponent: () => import('./features/dashboard/dashboard')},
    {path: 'recovery', canActivate: [nonAuthGuard],loadComponent: () => import('./features/auth/password-recovery/password-recovery')},
    {path: 'profile', canActivate: [authGuard],loadComponent: () => import('./features/user/user-profile/user-profile')},
    {path: 'task', canActivate: [authGuard],loadComponent: () => import('./features/tasks/post-task/post-task')},
    {path: 'task/:id', canActivate: [authGuard],loadComponent: () => import('./features/tasks/task-detail/task-detail')},
    {path: 'task-result', canActivate: [authGuard],loadComponent: () => import('./features/tasks/tasks-result/tasks-result')},
];
