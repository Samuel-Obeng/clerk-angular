import { Routes } from '@angular/router';
import { clerkAuthGuard } from 'clerk-angular';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'sign-in',
    loadComponent: () => import('./pages/sign-in-page.component').then(m => m.SignInPageComponent),
  },
  {
    path: 'sign-up',
    loadComponent: () => import('./pages/sign-up-page.component').then(m => m.SignUpPageComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [clerkAuthGuard({ signInUrl: '/sign-in' })],
  },
];
