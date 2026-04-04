import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);

  const allowedRoles = route.data?.['roles'] as string[] | undefined;

  if (!allowedRoles || allowedRoles.length === 0) {
    return true;
  }

  if (!authService.isLoggedIn()) {
    router.navigate(['/auth/login']);
    return false;
  }

  const hasAccess = allowedRoles.some(role => authService.hasRole(role));

  if (hasAccess) {
    return true;
  }

  if (authService.hasRole('support')) {
    router.navigate(['/admin/incidences']);
    return false;
  }

  if (authService.hasAnyRole(['admin', 'employee'])) {
    router.navigate(['/admin']);
    return false;
  }

  if (authService.hasRole('customer')) {
    router.navigate(['/']);
    return false;
  }

  router.navigate(['/']);
  return false;
};
