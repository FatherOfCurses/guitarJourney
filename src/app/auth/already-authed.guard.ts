// already-authed.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const AlreadyAuthedGuard: CanActivateFn = (_route, _state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  // If already signed in, send them to the app; otherwise allow access (true)
  return auth.isAuthed() ? router.createUrlTree(['/app']) : true;
};
