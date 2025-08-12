// app/routes.ts
import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { SessionComponent } from './features/session/session.component';
//import { AuthService } from './core/auth.service';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'sessions' },
  {
    path: 'sessions',
    component: SessionComponent
//    canActivate: [() => inject(AuthService).isLoggedInSignal()]
  },
/*
 {
    path: 'sessions/:id',
    component: SessionComponent
//    
{
    path: 'songs/:id',
    component: SongComponent
    
  },
{
  path: 'practice',
  component: PracticeComponent
}
  */
];
