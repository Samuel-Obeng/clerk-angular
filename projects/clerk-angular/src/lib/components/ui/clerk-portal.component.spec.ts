import { TestBed } from '@angular/core/testing';
import { Component, signal, ElementRef } from '@angular/core';
import { ClerkService } from '../../clerk.service';
import { CLERK_OPTIONS } from '../../clerk.tokens';
import { ClerkPortalComponent } from './clerk-portal.component';
import { createMockClerkInstance } from '../../../__mocks__/clerk-test-utils';

// Concrete test subclass to test the abstract ClerkPortalComponent
@Component({
  selector: 'test-portal',
  standalone: true,
  template: `@if (clerkService.loaded()) { <div #portal></div> }`,
})
class TestPortalComponent extends ClerkPortalComponent {
  protected mountName = 'mountSignIn';
  protected unmountName = 'unmountSignIn';

  protected getProps(): Record<string, unknown> {
    return { testProp: 'value' };
  }
}

function createMockClerkService(clerkInstance: any = null, loaded = false) {
  const _loaded = signal(loaded);
  const _clerk = signal(clerkInstance);
  return {
    loaded: _loaded.asReadonly(),
    clerk: _clerk.asReadonly(),
    _setLoaded: (v: boolean) => _loaded.set(v),
    _setClerk: (v: any) => _clerk.set(v),
  };
}

describe('ClerkPortalComponent', () => {
  let mockClerk: ReturnType<typeof createMockClerkInstance>;
  let mockService: ReturnType<typeof createMockClerkService>;

  beforeEach(() => {
    TestBed.resetTestingModule();
    mockClerk = createMockClerkInstance();
  });

  it('should not mount when clerk is null', () => {
    mockService = createMockClerkService(null, true);
    TestBed.configureTestingModule({
      imports: [TestPortalComponent],
      providers: [
        { provide: ClerkService, useValue: mockService },
        { provide: CLERK_OPTIONS, useValue: { publishableKey: 'pk_test' } },
      ],
    });

    const fixture = TestBed.createComponent(TestPortalComponent);
    fixture.detectChanges();

    expect(mockClerk.mountSignIn).not.toHaveBeenCalled();
  });

  it('should not mount when not loaded (no portal div rendered)', () => {
    mockService = createMockClerkService(mockClerk, false);
    TestBed.configureTestingModule({
      imports: [TestPortalComponent],
      providers: [
        { provide: ClerkService, useValue: mockService },
        { provide: CLERK_OPTIONS, useValue: { publishableKey: 'pk_test' } },
      ],
    });

    const fixture = TestBed.createComponent(TestPortalComponent);
    fixture.detectChanges();

    expect(mockClerk.mountSignIn).not.toHaveBeenCalled();
  });

  it('should call unmount on destroy when mounted', () => {
    mockService = createMockClerkService(mockClerk, true);
    TestBed.configureTestingModule({
      imports: [TestPortalComponent],
      providers: [
        { provide: ClerkService, useValue: mockService },
        { provide: CLERK_OPTIONS, useValue: { publishableKey: 'pk_test' } },
      ],
    });

    const fixture = TestBed.createComponent(TestPortalComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    const portalEl = fixture.nativeElement.querySelector('div');

    // Portal div must exist since loaded=true
    expect(portalEl).not.toBeNull();

    // Since afterNextRender won't fire in tests, simulate the mount
    (component as any).portal = { nativeElement: portalEl } as ElementRef;
    (component as any).tryMount();

    expect(mockClerk.mountSignIn).toHaveBeenCalledTimes(1);

    fixture.destroy();
    expect(mockClerk.unmountSignIn).toHaveBeenCalledWith(portalEl);
  });

  it('should not call unmount on destroy when not mounted', () => {
    mockService = createMockClerkService(null, false);
    TestBed.configureTestingModule({
      imports: [TestPortalComponent],
      providers: [
        { provide: ClerkService, useValue: mockService },
        { provide: CLERK_OPTIONS, useValue: { publishableKey: 'pk_test' } },
      ],
    });

    const fixture = TestBed.createComponent(TestPortalComponent);
    fixture.detectChanges();
    fixture.destroy();

    expect(mockClerk.unmountSignIn).not.toHaveBeenCalled();
  });

  it('should not mount if portal element is missing', () => {
    mockService = createMockClerkService(mockClerk, true);
    TestBed.configureTestingModule({
      imports: [TestPortalComponent],
      providers: [
        { provide: ClerkService, useValue: mockService },
        { provide: CLERK_OPTIONS, useValue: { publishableKey: 'pk_test' } },
      ],
    });

    const fixture = TestBed.createComponent(TestPortalComponent);
    const component = fixture.componentInstance;

    // Try to mount before detectChanges (portal not set)
    (component as any).tryMount();
    expect(mockClerk.mountSignIn).not.toHaveBeenCalled();
  });

  it('should pass props from getProps() to mount function', () => {
    mockService = createMockClerkService(mockClerk, true);
    TestBed.configureTestingModule({
      imports: [TestPortalComponent],
      providers: [
        { provide: ClerkService, useValue: mockService },
        { provide: CLERK_OPTIONS, useValue: { publishableKey: 'pk_test' } },
      ],
    });

    const fixture = TestBed.createComponent(TestPortalComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    const portalEl = fixture.nativeElement.querySelector('div');
    expect(portalEl).not.toBeNull();

    (component as any).portal = { nativeElement: portalEl } as ElementRef;
    (component as any).tryMount();

    expect(mockClerk.mountSignIn).toHaveBeenCalledTimes(1);
    expect(mockClerk.mountSignIn).toHaveBeenCalledWith(portalEl, { testProp: 'value' });
  });

  it('should not mount twice', () => {
    mockService = createMockClerkService(mockClerk, true);
    TestBed.configureTestingModule({
      imports: [TestPortalComponent],
      providers: [
        { provide: ClerkService, useValue: mockService },
        { provide: CLERK_OPTIONS, useValue: { publishableKey: 'pk_test' } },
      ],
    });

    const fixture = TestBed.createComponent(TestPortalComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    const portalEl = fixture.nativeElement.querySelector('div');
    expect(portalEl).not.toBeNull();

    (component as any).portal = { nativeElement: portalEl } as ElementRef;
    (component as any).tryMount();
    (component as any).tryMount(); // second call should be no-op

    expect(mockClerk.mountSignIn).toHaveBeenCalledTimes(1);
  });
});
