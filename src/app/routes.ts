// app/routes.ts
import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './core/auth.service';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'sessions' },
  {
    path: 'sessions',
    loadComponent: () => import('./features/sessions/sessions.page').then(m => m.SessionsPage),
    canActivate: [() => inject(AuthService).isLoggedInSignal()]
  },
  {
    path: 'songs/:id',
    loadComponent: () => import('./features/songs/song.page').then(m => m.SongPage),
    resolve: {
      song: () => inject(SongService).getResolvedSong() // returns Promise|Observable|value
    }
  }
];
