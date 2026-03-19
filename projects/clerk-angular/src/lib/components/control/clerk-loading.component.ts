import { Component, inject } from '@angular/core';
import { ClerkService } from '../../clerk.service';

@Component({
  selector: 'clerk-loading',
  standalone: true,
  template: `@if (!clerkService.loaded()) { <ng-content /> }`,
})
export class ClerkLoadingComponent {
  protected readonly clerkService = inject(ClerkService);
}
