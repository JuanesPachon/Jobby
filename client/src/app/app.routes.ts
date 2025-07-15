import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Register } from './features/auth/register/register';

export const routes: Routes = [
    {path: '', component: Home},
    {path: 'register', component: Register}
];
