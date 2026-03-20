import { Component, inject } from '@angular/core';
import { ClerkService } from '../../clerk.service';

/** Renders its content only when the user is signed out. Selector: `<clerk-signed-out>`. */
@Component({
  selector: 'clerk-signed-out',
  standalone: true,
  template: `@if (clerkService.loaded() && !clerkService.isSignedIn()) { <ng-content /> }`,
})
export class SignedOutComponent {
  protected readonly clerkService = inject(ClerkService);
}
