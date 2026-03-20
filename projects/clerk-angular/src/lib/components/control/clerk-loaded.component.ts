import { Component, inject } from '@angular/core';
import { ClerkService } from '../../clerk.service';

/** Renders its content only after Clerk has finished loading. Selector: `<clerk-loaded>`. */
@Component({
  selector: 'clerk-loaded',
  standalone: true,
  template: `@if (clerkService.loaded()) { <ng-content /> }`,
})
export class ClerkLoadedComponent {
  protected readonly clerkService = inject(ClerkService);
}
