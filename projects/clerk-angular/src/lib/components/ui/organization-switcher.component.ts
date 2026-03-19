import { Component, Input } from '@angular/core';
import { ClerkPortalComponent } from './clerk-portal.component';

@Component({
  selector: 'clerk-organization-switcher',
  standalone: true,
  template: `@if (clerkService.loaded()) { <div #portal></div> }`,
})
export class OrganizationSwitcherComponent extends ClerkPortalComponent {
  @Input() appearance?: Record<string, unknown>;
  @Input() hidePersonal?: boolean;
  @Input() afterCreateOrganizationUrl?: string;
  @Input() afterLeaveOrganizationUrl?: string;
  @Input() afterSelectOrganizationUrl?: string;
  @Input() afterSelectPersonalUrl?: string;
  @Input() organizationProfileMode?: 'modal' | 'navigation';
  @Input() organizationProfileUrl?: string;
  @Input() createOrganizationMode?: 'modal' | 'navigation';
  @Input() createOrganizationUrl?: string;

  protected mountName = 'mountOrganizationSwitcher';
  protected unmountName = 'unmountOrganizationSwitcher';

  protected getProps(): Record<string, unknown> {
    return {
      appearance: this.appearance,
      hidePersonal: this.hidePersonal,
      afterCreateOrganizationUrl: this.afterCreateOrganizationUrl,
      afterLeaveOrganizationUrl: this.afterLeaveOrganizationUrl,
      afterSelectOrganizationUrl: this.afterSelectOrganizationUrl,
      afterSelectPersonalUrl: this.afterSelectPersonalUrl,
      organizationProfileMode: this.organizationProfileMode,
      organizationProfileUrl: this.organizationProfileUrl,
      createOrganizationMode: this.createOrganizationMode,
      createOrganizationUrl: this.createOrganizationUrl,
    };
  }
}
