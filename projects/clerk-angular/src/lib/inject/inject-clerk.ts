import { inject } from '@angular/core';
import { ClerkService } from '../clerk.service';

export function injectClerk() {
  const clerkService = inject(ClerkService);
  return clerkService.clerk;
}
