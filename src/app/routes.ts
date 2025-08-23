// app/routes.ts
import { Routes } from '@angular/router';
import { PublicShellComponent } from './shells/public-shell.component';
import { AppShellComponent } from './shells/app-shell.component';
import { authGuard } from "./auth/auth.guard";
import { RegisterComponent } from './auth/register.component';
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
      {
        path: 'register',
        loadComponent: () =>
          import('./auth/register.component').then(m => m.RegisterComponent),
      }
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
//        loadComponent: () =>
//          import('./core/home/home.component')
//            .then(m => m.HomeComponent),
        title: 'Welcome',
      },
      {
        path: 'sessions',
        loadComponent: () =>
          import('./features/session/previous-sessions/previous-sessions.component').then(m => m.PreviousSessionsComponent),
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
        path: '**', redirectTo: 'app'  // catch-all, must be last
      }
    ],
  },

  // Fallback
  { path: '**', redirectTo: '' },
];
