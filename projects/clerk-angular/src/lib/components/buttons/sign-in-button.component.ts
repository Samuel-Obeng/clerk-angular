import { Component, Input, inject } from '@angular/core';
import { ClerkService } from '../../clerk.service';

/** Button that triggers the Clerk sign-in flow (modal or redirect). Selector: `<clerk-sign-in-button>`. */
@Component({
  selector: 'clerk-sign-in-button',
  standalone: true,
  template: `
    <button (click)="handleClick()">
      <ng-content>Sign in</ng-content>
    </button>
  `,
})
export class SignInButtonComponent {
  @Input() mode?: 'modal' | 'redirect';
  @Input() forceRedirectUrl?: string;
  @Input() fallbackRedirectUrl?: string;
  @Input() signUpForceRedirectUrl?: string;
  @Input() signUpFallbackRedirectUrl?: string;

  private readonly clerkService = inject(ClerkService);

  handleClick(): void {
    const clerk = this.clerkService.clerk();
    if (!clerk) return;

    if (this.mode === 'modal') {
      (clerk as any).openSignIn({
        forceRedirectUrl: this.forceRedirectUrl,
        fallbackRedirectUrl: this.fallbackRedirectUrl,
        signUpForceRedirectUrl: this.signUpForceRedirectUrl,
        signUpFallbackRedirectUrl: this.signUpFallbackRedirectUrl,
      });
    } else {
      (clerk as any).redirectToSignIn({
        forceRedirectUrl: this.forceRedirectUrl,
        fallbackRedirectUrl: this.fallbackRedirectUrl,
        signUpForceRedirectUrl: this.signUpForceRedirectUrl,
        signUpFallbackRedirectUrl: this.signUpFallbackRedirectUrl,
      });
    }
  }
}
