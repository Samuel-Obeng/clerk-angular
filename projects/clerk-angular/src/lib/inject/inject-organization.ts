import { inject } from '@angular/core';
import { ClerkService } from '../clerk.service';

/** Returns a read-only signal of the active Clerk organization, or `null` if none. */
export function injectOrganization() {
  const clerkService = inject(ClerkService);
  return clerkService.organization;
}
