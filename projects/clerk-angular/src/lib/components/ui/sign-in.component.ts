import { Component, Input } from '@angular/core';
import { ClerkPortalComponent } from './clerk-portal.component';

/** Renders the Clerk Sign In form. Selector: `<clerk-sign-in>`. */
@Component({
  selector: 'clerk-sign-in',
  standalone: true,
  template: `@if (clerkService.loaded()) { <div #portal></div> }`,
})
export class SignInComponent extends ClerkPortalComponent {
  @Input() appearance?: Record<string, unknown>;
  @Input() routing?: string;
  @Input() path?: string;
  @Input() redirectUrl?: string;
  @Input() signUpUrl?: string;
  @Input() forceRedirectUrl?: string;
  @Input() fallbackRedirectUrl?: string;
  @Input() signUpForceRedirectUrl?: string;
  @Input() signUpFallbackRedirectUrl?: string;
  @Input() transferable?: boolean;
  @Input() initialValues?: Record<string, unknown>;

  protected mountName = 'mountSignIn';
  protected unmountName = 'unmountSignIn';

  protected getProps(): Record<string, unknown> {
    return {
      appearance: this.appearance,
      routing: this.routing,
      path: this.path,
      redirectUrl: this.redirectUrl,
      signUpUrl: this.signUpUrl,
      forceRedirectUrl: this.forceRedirectUrl,
      fallbackRedirectUrl: this.fallbackRedirectUrl,
      signUpForceRedirectUrl: this.signUpForceRedirectUrl,
      signUpFallbackRedirectUrl: this.signUpFallbackRedirectUrl,
      transferable: this.transferable,
      initialValues: this.initialValues,
    };
  }
}
