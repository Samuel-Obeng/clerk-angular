import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { from, switchMap } from 'rxjs';
import { ClerkService } from '../clerk.service';

export const clerkTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const clerkService = inject(ClerkService);
  const session = clerkService.session();

  if (!session) {
    return next(req);
  }

  return from(clerkService.getToken()).pipe(
    switchMap((token) => {
      if (!token) {
        return next(req);
      }

      const authedReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
      return next(authedReq);
    }),
  );
};
