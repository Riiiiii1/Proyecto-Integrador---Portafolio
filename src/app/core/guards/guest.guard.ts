import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth/auth';

// Si ya hay sesión, no puede entrar a /login, lo manda al home
export const guestGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);
  return !auth.isLoggedIn() ? true : router.createUrlTree(['/']);
};