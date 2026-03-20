import { Component, Input } from '@angular/core';
import { ClerkPortalComponent } from './clerk-portal.component';

/** Renders the Clerk Sign Up form. Selector: `<clerk-sign-up>`. */
@Component({
  selector: 'clerk-sign-up',
  standalone: true,
  template: `@if (clerkService.loaded()) { <div #portal></div> }`,
})
export class SignUpComponent extends ClerkPortalComponent {
  @Input() appearance?: Record<string, unknown>;
  @Input() routing?: string;
  @Input() path?: string;
  @Input() redirectUrl?: string;
  @Input() signInUrl?: string;
  @Input() forceRedirectUrl?: string;
  @Input() fallbackRedirectUrl?: string;
  @Input() signInForceRedirectUrl?: string;
  @Input() signInFallbackRedirectUrl?: string;
  @Input() unsafeMetadata?: Record<string, unknown>;
  @Input() initialValues?: Record<string, unknown>;

  protected mountName = 'mountSignUp';
  protected unmountName = 'unmountSignUp';

  protected getProps(): Record<string, unknown> {
    return {
      appearance: this.appearance,
      routing: this.routing,
      path: this.path,
      redirectUrl: this.redirectUrl,
      signInUrl: this.signInUrl,
      forceRedirectUrl: this.forceRedirectUrl,
      fallbackRedirectUrl: this.fallbackRedirectUrl,
      signInForceRedirectUrl: this.signInForceRedirectUrl,
      signInFallbackRedirectUrl: this.signInFallbackRedirectUrl,
      unsafeMetadata: this.unsafeMetadata,
      initialValues: this.initialValues,
    };
  }
}
