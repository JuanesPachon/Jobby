import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.hasLocalToken()) {
    router.navigate(['/login']);
    return false;
  }

  return authService.validateToken().pipe(
    map((response) => {
      if (response.success) {
        return true;
      } else {
        router.navigate(['/login']);
        return false;
      }
    }),
    catchError(() => {
      router.navigate(['/login']);
      return of(false);
    })
  );
};

export const nonAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.hasLocalToken()) {
    console.log('🌐 No local token - allowing access to public route');
    return true;
  }

  return authService.validateToken().pipe(
    map((response) => {
      if (response.success) {
        router.navigate(['/dashboard']);
        return false;
      } else {
        return true;
      }
    }),
    catchError(() => {
      return of(true);
    })
  );
};