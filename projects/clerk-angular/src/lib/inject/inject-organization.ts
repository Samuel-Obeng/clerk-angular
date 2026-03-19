import { inject } from '@angular/core';
import { ClerkService } from '../clerk.service';

export function injectOrganization() {
  const clerkService = inject(ClerkService);
  return clerkService.organization;
}
