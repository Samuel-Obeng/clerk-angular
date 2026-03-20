import { inject } from '@angular/core';
import { ClerkService } from '../clerk.service';

/** Returns a read-only signal of the active Clerk session, or `null` if none. */
export function injectSession() {
  const clerkService = inject(ClerkService);
  return clerkService.session;
}
