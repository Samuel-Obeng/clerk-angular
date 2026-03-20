import { Component, Input } from '@angular/core';
import { ClerkPortalComponent } from './clerk-portal.component';

/** Renders the Clerk organization profile management page. Selector: `<clerk-organization-profile>`. */
@Component({
  selector: 'clerk-organization-profile',
  standalone: true,
  template: `@if (clerkService.loaded()) { <div #portal></div> }`,
})
export class OrganizationProfileComponent extends ClerkPortalComponent {
  @Input() appearance?: Record<string, unknown>;
  @Input() routing?: string;
  @Input() path?: string;
  @Input() afterLeaveOrganizationUrl?: string;

  protected mountName = 'mountOrganizationProfile';
  protected unmountName = 'unmountOrganizationProfile';

  protected getProps(): Record<string, unknown> {
    return {
      appearance: this.appearance,
      routing: this.routing,
      path: this.path,
      afterLeaveOrganizationUrl: this.afterLeaveOrganizationUrl,
    };
  }
}
