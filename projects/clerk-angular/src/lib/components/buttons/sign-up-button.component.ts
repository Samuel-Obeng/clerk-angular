import { Component, Input, inject } from '@angular/core';
import { ClerkService } from '../../clerk.service';

@Component({
  selector: 'clerk-sign-up-button',
  standalone: true,
  template: `
    <button (click)="handleClick()">
      <ng-content>Sign up</ng-content>
    </button>
  `,
})
export class SignUpButtonComponent {
  @Input() mode?: 'modal' | 'redirect';
  @Input() forceRedirectUrl?: string;
  @Input() fallbackRedirectUrl?: string;
  @Input() signInForceRedirectUrl?: string;
  @Input() signInFallbackRedirectUrl?: string;

  private readonly clerkService = inject(ClerkService);

  handleClick(): void {
    const clerk = this.clerkService.clerk();
    if (!clerk) return;

    if (this.mode === 'modal') {
      (clerk as any).openSignUp({
        forceRedirectUrl: this.forceRedirectUrl,
        fallbackRedirectUrl: this.fallbackRedirectUrl,
        signInForceRedirectUrl: this.signInForceRedirectUrl,
        signInFallbackRedirectUrl: this.signInFallbackRedirectUrl,
      });
    } else {
      (clerk as any).redirectToSignUp({
        forceRedirectUrl: this.forceRedirectUrl,
        fallbackRedirectUrl: this.fallbackRedirectUrl,
        signInForceRedirectUrl: this.signInForceRedirectUrl,
        signInFallbackRedirectUrl: this.signInFallbackRedirectUrl,
      });
    }
  }
}
