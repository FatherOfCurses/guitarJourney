import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';

export const AlreadyAuthedGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  return new Promise<boolean>(resolve => {
    const unsub = auth.onAuthStateChanged(user => {
      unsub();
      if (user) {
        router.navigateByUrl('/app'); // or '/app'
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
};
