import { Component, Input } from '@angular/core';
import { ClerkPortalComponent } from './clerk-portal.component';

@Component({
  selector: 'clerk-organization-list',
  standalone: true,
  template: `@if (clerkService.loaded()) { <div #portal></div> }`,
})
export class OrganizationListComponent extends ClerkPortalComponent {
  @Input() appearance?: Record<string, unknown>;
  @Input() hidePersonal?: boolean;
  @Input() afterCreateOrganizationUrl?: string;
  @Input() afterSelectOrganizationUrl?: string;
  @Input() afterSelectPersonalUrl?: string;

  protected mountName = 'mountOrganizationList';
  protected unmountName = 'unmountOrganizationList';

  protected getProps(): Record<string, unknown> {
    return {
      appearance: this.appearance,
      hidePersonal: this.hidePersonal,
      afterCreateOrganizationUrl: this.afterCreateOrganizationUrl,
      afterSelectOrganizationUrl: this.afterSelectOrganizationUrl,
      afterSelectPersonalUrl: this.afterSelectPersonalUrl,
    };
  }
}
