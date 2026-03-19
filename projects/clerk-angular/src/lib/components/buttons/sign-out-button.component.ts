import { Component, Input, inject } from '@angular/core';
import { ClerkService } from '../../clerk.service';

@Component({
  selector: 'clerk-sign-out-button',
  standalone: true,
  template: `
    <button (click)="handleClick()">
      <ng-content>Sign out</ng-content>
    </button>
  `,
})
export class SignOutButtonComponent {
  @Input() redirectUrl?: string;
  @Input() sessionId?: string;

  private readonly clerkService = inject(ClerkService);

  handleClick(): void {
    this.clerkService.signOut({
      redirectUrl: this.redirectUrl,
      sessionId: this.sessionId,
    });
  }
}
