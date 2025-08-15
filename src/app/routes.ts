import { Routes } from '@angular/router';
import { AppShellComponent } from './app-shell.component'

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
      { path: 'sessions', loadComponent: () => import('./features/session/session.component').then(m => m.SessionComponent) },
      { path: 'songs',    loadComponent: () => import('./features/songs/songs.component').then(m => m.SongsComponent) },
      { path: 'metrics',  loadComponent: () => import('./features/metrics/metrics.component').then(m => m.MetricsComponent) },
    ],
  },

  // 404
  { path: '**', loadComponent: () => import('./core/not-found/not-found.component').then(m => m.NotFoundComponent) },
];
