import { inject } from '@angular/core';
import { ClerkService } from '../clerk.service';

export function injectSession() {
  const clerkService = inject(ClerkService);
  return clerkService.session;
}
