import { Component, Input } from '@angular/core';
import { ClerkPortalComponent } from './clerk-portal.component';

/** Renders the Clerk waitlist sign-up form. Selector: `<clerk-waitlist>`. */
@Component({
  selector: 'clerk-waitlist',
  standalone: true,
  template: `@if (clerkService.loaded()) { <div #portal></div> }`,
})
export class WaitlistComponent extends ClerkPortalComponent {
  @Input() appearance?: Record<string, unknown>;
  @Input() afterJoinWaitlistUrl?: string;
  @Input() signInUrl?: string;

  protected mountName = 'mountWaitlist';
  protected unmountName = 'unmountWaitlist';

  protected getProps(): Record<string, unknown> {
    return {
      appearance: this.appearance,
      afterJoinWaitlistUrl: this.afterJoinWaitlistUrl,
      signInUrl: this.signInUrl,
    };
  }
}
