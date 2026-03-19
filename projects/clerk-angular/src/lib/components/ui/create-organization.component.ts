import { Component, Input } from '@angular/core';
import { ClerkPortalComponent } from './clerk-portal.component';

@Component({
  selector: 'clerk-create-organization',
  standalone: true,
  template: `@if (clerkService.loaded()) { <div #portal></div> }`,
})
export class CreateOrganizationComponent extends ClerkPortalComponent {
  @Input() appearance?: Record<string, unknown>;
  @Input() routing?: string;
  @Input() path?: string;
  @Input() afterCreateOrganizationUrl?: string;
  @Input() skipInvitationScreen?: boolean;

  protected mountName = 'mountCreateOrganization';
  protected unmountName = 'unmountCreateOrganization';

  protected getProps(): Record<string, unknown> {
    return {
      appearance: this.appearance,
      routing: this.routing,
      path: this.path,
      afterCreateOrganizationUrl: this.afterCreateOrganizationUrl,
      skipInvitationScreen: this.skipInvitationScreen,
    };
  }
}
