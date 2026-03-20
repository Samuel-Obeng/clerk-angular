import { Component, inject } from '@angular/core';
import { ClerkService } from '../../clerk.service';

/** Renders its content only when the user is signed in. Selector: `<clerk-signed-in>`. */
@Component({
  selector: 'clerk-signed-in',
  standalone: true,
  template: `@if (clerkService.loaded() && clerkService.isSignedIn()) { <ng-content /> }`,
})
export class SignedInComponent {
  protected readonly clerkService = inject(ClerkService);
}
