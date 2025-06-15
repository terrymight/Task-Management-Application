import { Routes } from '@angular/router';

export const routes: Routes = [
    {path: 'login', loadComponent: ()=>import('./components/login/login').then( m => m.Login )},
    {path: 'signup', loadComponent: () =>import('./components/signup/signup').then( m => m.Signup )},
    {path: 'task', loadComponent: () => import('./components/tasks/tasks').then( m => m.Tasks )},
    { path: '', redirectTo: '/login', pathMatch: 'full' }
];
