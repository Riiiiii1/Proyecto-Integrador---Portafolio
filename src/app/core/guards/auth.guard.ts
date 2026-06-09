import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth as FirebaseAuth, authState } from '@angular/fire/auth';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const auth = inject(FirebaseAuth);
  const router = inject(Router);
  return authState(auth).pipe(
    take(1),
    map(user => (user ? true : router.createUrlTree(['/login'])))
  );
};