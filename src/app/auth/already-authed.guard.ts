// auth/already-authed.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const AlreadyAuthedGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isAuthed()) {
    router.navigateByUrl('/app');
    return false;
  }
  return true;
};
