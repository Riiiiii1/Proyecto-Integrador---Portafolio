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
      if (!user || !user.email) return router.createUrlTree(['/login']);
      const emailsProgramadores = ['sisabuestandavidesteban@gmail.com', 
         'antoniogordillo.1808@gmail.com',
          'caunidrive@gmail.com'];
      return emailsProgramadores.includes(user.email) ? true : router.createUrlTree(['/']);
    })
  );
};