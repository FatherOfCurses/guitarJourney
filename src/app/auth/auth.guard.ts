// auth.guard.ts
import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { map, take } from 'rxjs/operators';

export const AuthGuard: CanMatchFn = (route, segments) => {
  const auth = inject(Auth);
  const router = inject(Router);
  const url = '/' + segments.map(s => s.path).join('/');

  return authState(auth).pipe(
    take(1),
    map(user => user ? true : router.createUrlTree(['/login'], { queryParams: { redirect: url } }))
  );
};
