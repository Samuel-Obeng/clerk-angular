import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { from, switchMap } from 'rxjs';
import { ClerkService } from '../clerk.service';

/**
 * Angular HTTP interceptor that automatically attaches a Clerk session
 * token as a `Bearer` authorization header to outgoing requests.
 *
 * Requests are passed through unmodified when there is no active session
 * or when a token cannot be obtained.
 *
 * @example
 * ```typescript
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideClerk({ publishableKey: 'pk_live_...' }),
 *     provideHttpClient(withInterceptors([clerkTokenInterceptor])),
 *   ],
 * };
 * ```
 */
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
