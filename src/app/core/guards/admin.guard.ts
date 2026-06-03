import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth as FirebaseAuth, authState } from '@angular/fire/auth';
import { map, take } from 'rxjs';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(FirebaseAuth);
  const router = inject(Router);

  return authState(auth).pipe(
    take(1),
    map(user => {
      // Si no está logueado, lo manda al login
      if (!user || !user.email) return router.createUrlTree(['/login']);
      
      // Si está logueado, verificamos si es programador
      const emailsProgramadores = ['david@email.com', 'carlos@email.com', 'antoniogordillo.1808@gmail.com'];
      return emailsProgramadores.includes(user.email) ? true : router.createUrlTree(['/']);
    })
  );
};