import { Component, Input } from '@angular/core';
import { ClerkPortalComponent } from './clerk-portal.component';

@Component({
  selector: 'clerk-user-button',
  standalone: true,
  template: `@if (clerkService.loaded()) { <div #portal></div> }`,
})
export class UserButtonComponent extends ClerkPortalComponent {
  @Input() appearance?: Record<string, unknown>;
  @Input() afterSignOutUrl?: string;
  @Input() afterMultiSessionSingleSignOutUrl?: string;
  @Input() afterSwitchSessionUrl?: string;
  @Input() showName?: boolean;
  @Input() signInUrl?: string;
  @Input() userProfileMode?: 'modal' | 'navigation';
  @Input() userProfileUrl?: string;

  protected mountName = 'mountUserButton';
  protected unmountName = 'unmountUserButton';

  protected getProps(): Record<string, unknown> {
    return {
      appearance: this.appearance,
      afterSignOutUrl: this.afterSignOutUrl,
      afterMultiSessionSingleSignOutUrl: this.afterMultiSessionSingleSignOutUrl,
      afterSwitchSessionUrl: this.afterSwitchSessionUrl,
      showName: this.showName,
      signInUrl: this.signInUrl,
      userProfileMode: this.userProfileMode,
      userProfileUrl: this.userProfileUrl,
    };
  }
}
