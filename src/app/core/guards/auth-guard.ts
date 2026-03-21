import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Storage } from '../services/storage';

export const authGuard: CanActivateFn = (route, state) => {
  const storageService = inject(Storage);
  const router = inject(Router);

  if (storageService.isLoggedIn()) {
    return true;
  }

  return router.createUrlTree(['/auth/login']);
};
