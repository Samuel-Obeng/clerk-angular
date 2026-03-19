import { Component, inject } from '@angular/core';
import { ClerkService } from '../../clerk.service';

@Component({
  selector: 'clerk-signed-in',
  standalone: true,
  template: `@if (clerkService.loaded() && clerkService.isSignedIn()) { <ng-content /> }`,
})
export class SignedInComponent {
  protected readonly clerkService = inject(ClerkService);
}
