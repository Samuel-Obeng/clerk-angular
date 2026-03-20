import { Component, inject } from '@angular/core';
import { ClerkService } from '../../clerk.service';

/** Renders its content only while Clerk is still loading. Selector: `<clerk-loading>`. */
@Component({
  selector: 'clerk-loading',
  standalone: true,
  template: `@if (!clerkService.loaded()) { <ng-content /> }`,
})
export class ClerkLoadingComponent {
  protected readonly clerkService = inject(ClerkService);
}
