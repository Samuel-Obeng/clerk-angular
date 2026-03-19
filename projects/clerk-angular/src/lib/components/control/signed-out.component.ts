import { Component, inject } from '@angular/core';
import { ClerkService } from '../../clerk.service';

@Component({
  selector: 'clerk-signed-out',
  standalone: true,
  template: `@if (clerkService.loaded() && !clerkService.isSignedIn()) { <ng-content /> }`,
})
export class SignedOutComponent {
  protected readonly clerkService = inject(ClerkService);
}
