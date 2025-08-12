import { Routes } from '@angular/router';
import { AppShellComponent } from './app-shell.component';
import { LoginComponent } from './auth/login.component';
import { HomeComponent } from './core/home/home.component';

export const routes: Routes = [
  // Public/auth routes (no shell)
  {
    path: 'login',
    loadComponent: () => import('./auth/login.component').then(m => m.LoginComponent),
  },

  // Everything under the shell (top nav always visible)
  {
    path: '',
    component: AppShellComponent,
    children: [
      { path: '', pathMatch: 'full', loadComponent: () => import('./core/home/home.component').then(m => m.HomeComponent) },
      { path: 'sessions', loadChildren: () => import('./sessions/routes').then(m => m.SESSIONS_ROUTES) },
      { path: 'songs',    loadChildren: () => import('./songs/routes').then(m => m.SONGS_ROUTES) },
      { path: 'metrics',  loadComponent: () => import('./metrics/metrics.component').then(m => m.MetricsComponent) },
    ],
  },

  // 404
  { path: '**', loadComponent: () => import('./not-found/not-found.component').then(m => m.NotFoundComponent) },
];
