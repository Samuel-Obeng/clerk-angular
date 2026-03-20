import { Component, Input } from '@angular/core';
import { ClerkPortalComponent } from './clerk-portal.component';

/** Renders the Clerk pricing table. Selector: `<clerk-pricing-table>`. */
@Component({
  selector: 'clerk-pricing-table',
  standalone: true,
  template: `@if (clerkService.loaded()) { <div #portal></div> }`,
})
export class PricingTableComponent extends ClerkPortalComponent {
  @Input() appearance?: Record<string, unknown>;

  protected mountName = 'mountPricingTable';
  protected unmountName = 'unmountPricingTable';

  protected getProps(): Record<string, unknown> {
    return {
      appearance: this.appearance,
    };
  }
}
