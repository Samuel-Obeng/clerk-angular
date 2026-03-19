import { inject } from '@angular/core';
import { ClerkService } from '../clerk.service';

export function injectUser() {
  const clerkService = inject(ClerkService);
  return clerkService.user;
}
