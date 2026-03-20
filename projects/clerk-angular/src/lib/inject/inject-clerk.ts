import { inject } from '@angular/core';
import { ClerkService } from '../clerk.service';

/** Returns a read-only signal of the Clerk instance. Must be called in an injection context. */
export function injectClerk() {
  const clerkService = inject(ClerkService);
  return clerkService.clerk;
}
