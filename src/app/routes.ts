// app/routes.ts
import { Routes } from '@angular/router';
import { PublicShellComponent } from './shells/public-shell.component';
import { AppShellComponent } from './shells/app-shell.component';
import { AuthGuard } from "./auth/auth.guard";
import { AlreadyAuthedGuard } from './auth/already-authed.guard';
import { DashboardResolver } from './features/dashboard/dashboard.resolver';

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
      {
        path: 'register',
        canActivate: [AlreadyAuthedGuard],
        loadComponent: () =>
          import('./auth/register.component').then(m => m.RegisterComponent),
      }
    ],
  },

  // PRIVATE AREA
  {
    path: 'app',
    component: AppShellComponent,     // your existing shell (top nav)
    canMatch: [AuthGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component')
            .then(m => m.DashboardComponent),
        resolve : { dashboard: DashboardResolver }, 
        title: 'Welcome',
      },
      {
        path: 'sessions',
        loadComponent: () =>
          import('./features/session/previous-sessions/previous-sessions.component').then(m => m.PreviousSessionsComponent),
      },
      {
        path: 'newSession',
        loadComponent: () =>
          import('./features/session/session.component').then(m => m.SessionComponent),
      },
      {
        path: 'sessionDetail/:id',
        loadComponent: () =>
          import('./features/session/display-single-session/display-session.component').then(m => m.DisplaySessionComponent),
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
      {
        path: '**', 
        loadComponent:()  =>
          import('./core/not-found/not-found.component')
            .then(m => m.NotFoundComponent),
        },        
    ],
  },

  // Fallback
  {
    path: '**', 
    loadComponent:()  =>
      import('./core/not-found/not-found.component')
        .then(m => m.NotFoundComponent),
    }, 
];
