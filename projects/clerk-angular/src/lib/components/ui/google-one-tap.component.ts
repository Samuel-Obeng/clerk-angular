import { Component, Input } from '@angular/core';
import { ClerkPortalComponent } from './clerk-portal.component';

/** Renders the Google One Tap sign-in prompt. Selector: `<clerk-google-one-tap>`. */
@Component({
  selector: 'clerk-google-one-tap',
  standalone: true,
  template: `@if (clerkService.loaded()) { <div #portal></div> }`,
})
export class GoogleOneTapComponent extends ClerkPortalComponent {
  @Input() appearance?: Record<string, unknown>;
  @Input() cancelOnTapOutside?: boolean;
  @Input() itpSupport?: boolean;
  @Input() fedCmSupport?: boolean;

  protected mountName = 'openGoogleOneTap';
  protected unmountName = 'closeGoogleOneTap';

  protected getProps(): Record<string, unknown> {
    return {
      appearance: this.appearance,
      cancelOnTapOutside: this.cancelOnTapOutside,
      itpSupport: this.itpSupport,
      fedCmSupport: this.fedCmSupport,
    };
  }
}
