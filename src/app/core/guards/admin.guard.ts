import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth/auth';

// Solo permite pasar si es programador (tú o David)
export const adminGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);
  return auth.isProgramador() ? true : router.createUrlTree(['/']);
};