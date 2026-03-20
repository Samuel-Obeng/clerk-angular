import { Component, Input } from '@angular/core';
import { ClerkPortalComponent } from './clerk-portal.component';

/** Renders the Clerk user profile management page. Selector: `<clerk-user-profile>`. */
@Component({
  selector: 'clerk-user-profile',
  standalone: true,
  template: `@if (clerkService.loaded()) { <div #portal></div> }`,
})
export class UserProfileComponent extends ClerkPortalComponent {
  @Input() appearance?: Record<string, unknown>;
  @Input() routing?: string;
  @Input() path?: string;

  protected mountName = 'mountUserProfile';
  protected unmountName = 'unmountUserProfile';

  protected getProps(): Record<string, unknown> {
    return {
      appearance: this.appearance,
      routing: this.routing,
      path: this.path,
    };
  }
}
