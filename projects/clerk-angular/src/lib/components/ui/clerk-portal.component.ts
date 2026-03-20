import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
  afterNextRender,
  inject,
} from '@angular/core';
import { ClerkService } from '../../clerk.service';

/**
 * Abstract base component for Clerk UI portals.
 *
 * Subclasses specify a `mountName` / `unmountName` pair and the Clerk JS
 * component is mounted into a `<div>` once the Clerk instance is loaded.
 * The component is automatically unmounted on destroy.
 */
@Component({
  selector: 'clerk-portal',
  standalone: true,
  template: `@if (clerkService.loaded()) { <div #portal></div> }`,
})
export abstract class ClerkPortalComponent implements OnDestroy {
  @ViewChild('portal') portal!: ElementRef<HTMLDivElement>;

  protected readonly clerkService = inject(ClerkService);
  private mounted = false;

  constructor() {
    afterNextRender(() => {
      this.tryMount();
    });
  }

  protected abstract mountName: string;
  protected abstract unmountName: string;
  protected abstract getProps(): Record<string, unknown>;

  private tryMount(): void {
    if (this.mounted || !this.portal?.nativeElement) return;
    const clerk = this.clerkService.clerk();
    if (!clerk) return;

    const mountFn = (clerk as any)[this.mountName];
    if (typeof mountFn === 'function') {
      mountFn.call(clerk, this.portal.nativeElement, this.getProps());
      this.mounted = true;
    }
  }

  ngOnDestroy(): void {
    if (!this.mounted || !this.portal?.nativeElement) return;
    const clerk = this.clerkService.clerk();
    if (!clerk) return;

    const unmountFn = (clerk as any)[this.unmountName];
    if (typeof unmountFn === 'function') {
      unmountFn.call(clerk, this.portal.nativeElement);
    }
    this.mounted = false;
  }
}
