import { inject } from '@angular/core';
import { ClerkService } from '../clerk.service';

export function injectAuth() {
  const clerkService = inject(ClerkService);
  return clerkService.auth;
}
