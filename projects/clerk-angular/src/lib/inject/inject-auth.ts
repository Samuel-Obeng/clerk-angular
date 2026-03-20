import { inject } from '@angular/core';
import { ClerkService } from '../clerk.service';

/** Returns a read-only signal of the current auth state (userId, sessionId, orgId, etc.). */
export function injectAuth() {
  const clerkService = inject(ClerkService);
  return clerkService.auth;
}
