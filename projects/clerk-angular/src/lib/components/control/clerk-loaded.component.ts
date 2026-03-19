import { Component, inject } from '@angular/core';
import { ClerkService } from '../../clerk.service';

@Component({
  selector: 'clerk-loaded',
  standalone: true,
  template: `@if (clerkService.loaded()) { <ng-content /> }`,
})
export class ClerkLoadedComponent {
  protected readonly clerkService = inject(ClerkService);
}
