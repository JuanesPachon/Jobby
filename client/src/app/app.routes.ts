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
    {path: 'profile/:id', canActivate: [authGuard],loadComponent: () => import('./features/user/public-profile/public-profile')},
    {path: 'task', canActivate: [authGuard],loadComponent: () => import('./features/tasks/post-task/post-task')},
    {path: 'task/:id', canActivate: [authGuard],loadComponent: () => import('./features/tasks/task-detail/task-detail')},
    {path: 'task-result', canActivate: [authGuard],loadComponent: () => import('./features/tasks/tasks-result/tasks-result')},
    {path: 'my-tasks', canActivate: [authGuard],loadComponent: () => import('./features/tasks/my-tasks/my-tasks')},
    {path: 'applied-tasks', canActivate: [authGuard],loadComponent: () => import('./features/tasks/applied-tasks/applied-tasks')},
    {path: 'published-tasks', canActivate: [authGuard],loadComponent: () => import('./features/tasks/published-tasks/published-tasks')},
    {path: 'published-task/:id', canActivate: [authGuard],loadComponent: () => import('./features/tasks/published-task-detail/published-task-detail')},
    {
        path: 'help', 
        loadComponent: () => import('./features/help/help-view'),
        children: [
            {path: 'terms', loadComponent: () => import('./features/help/terms/terms')},
            {path: 'faq', loadComponent: () => import('./features/help/faq/faq')}
        ]
    },
    {path: '**', redirectTo: 'dashboard'}
];
