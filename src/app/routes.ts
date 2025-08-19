// app/routes.ts
import { Routes } from '@angular/router';
import { PublicShellComponent } from './shells/public-shell.component';
import { AppShellComponent } from './shells/app-shell.component';
import { authGuard } from "./auth/auth.guard";
import { AlreadyAuthedGuard } from './auth/already-authed.guard';

export const routes: Routes = [
  // PUBLIC AREA
  {
    path: '',
    component: PublicShellComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./welcome/welcome.component')
            .then(m => m.WelcomeComponent),
        title: 'Guitar Journey',
      },
      {
        path: 'login',
        canActivate: [AlreadyAuthedGuard],
        loadComponent: () =>
          import('./auth/login.component').then(m => m.LoginComponent),
        title: 'Sign in',
      },
    ],
  },

  // PRIVATE AREA
  {
    path: 'app',
    component: AppShellComponent,     // your existing shell (top nav)
    canActivate: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component')
            .then(m => m.DashboardComponent),
        resolve: {
          prefetch: () =>('./features/dashboard/dashboard.resolver')

        },
        title: 'Dashboard',
      },
      {
        path: 'sessions',
        loadComponent: () =>
          import('./features/session/session.component').then(m => m.SessionComponent),
      },
      {
        path: 'songs',
        loadComponent: () =>
          import('./features/songs/songs.component').then(m => m.SongsComponent),
      },
      {
        path: 'metrics',
        loadComponent: () =>
          import('./features/metrics/metrics.component').then(m => m.MetricsComponent),
      },
    ],
  },

  // Fallback
  { path: '**', redirectTo: '' },
];
