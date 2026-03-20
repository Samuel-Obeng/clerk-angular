import { inject } from '@angular/core';
import { type CanActivateFn, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ClerkService } from '../clerk.service';

/** Options for {@link clerkAuthGuard}. */
export interface ClerkAuthGuardOptions {
  signInUrl?: string;
  orgRole?: string;
  orgPermission?: string;
}

/**
 * Angular route guard that requires an authenticated Clerk session.
 * Optionally checks for a specific organization role or permission.
 *
 * @example
 * ```typescript
 * {
 *   path: 'dashboard',
 *   canActivate: [clerkAuthGuard({ signInUrl: '/sign-in' })],
 *   loadComponent: () => import('./dashboard.component'),
 * }
 * ```
 */
export const clerkAuthGuard = (options?: ClerkAuthGuardOptions): CanActivateFn => {
  return () => {
    const clerkService = inject(ClerkService);
    const router = inject(Router);
    const signInUrl = options?.signInUrl ?? '/sign-in';

    const check = (): boolean | import('@angular/router').UrlTree => {
      const auth = clerkService.auth();
      if (!auth.userId) {
        return router.createUrlTree([signInUrl]);
      }

      if (options?.orgRole && auth.orgRole !== options.orgRole) {
        return router.createUrlTree([signInUrl]);
      }

      if (options?.orgPermission) {
        const permissions = auth.orgPermissions ?? [];
        if (!permissions.includes(options.orgPermission)) {
          return router.createUrlTree([signInUrl]);
        }
      }

      return true;
    };

    if (clerkService.loaded()) {
      return check();
    }

    return new Observable<boolean | import('@angular/router').UrlTree>((subscriber) => {
      const interval = setInterval(() => {
        if (clerkService.loaded()) {
          clearInterval(interval);
          subscriber.next(check());
          subscriber.complete();
        }
      }, 50);

      return () => clearInterval(interval);
    });
  };
};
