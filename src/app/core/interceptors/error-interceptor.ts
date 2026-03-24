import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { Storage } from '../services/storage';
import { Notification } from '../services/notification';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const storageService = inject(Storage);
  const notificationService = inject(Notification);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        storageService.clearAuth();
        notificationService.error('Tu sesión ha expirado. Vuelve a iniciar sesión.');
        router.navigate(['/auth/login']);
      } else if (error.status === 403) {
        notificationService.error('No tienes permisos para acceder a este recurso.');
      } else if (error.status >= 500) {
        notificationService.error('Se ha producido un error interno del servidor.');
      }

      return throwError(() => error);
    })
  );
};
