import { inject } from '@angular/core';
import { ClerkService } from '../clerk.service';

/** Returns a read-only signal of the current Clerk user, or `null` if not signed in. */
export function injectUser() {
  const clerkService = inject(ClerkService);
  return clerkService.user;
}
