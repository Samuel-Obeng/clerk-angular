import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { ClerkService } from '../../clerk.service';
import { CLERK_OPTIONS } from '../../clerk.tokens';
import { ClerkLoadedComponent } from './clerk-loaded.component';
import { ClerkLoadingComponent } from './clerk-loading.component';
import { SignedInComponent } from './signed-in.component';
import { SignedOutComponent } from './signed-out.component';

function createMockClerkService() {
  const _loaded = signal(false);
  const _isSignedIn = signal(false);
  return {
    loaded: _loaded.asReadonly(),
    isSignedIn: _isSignedIn.asReadonly(),
    _setLoaded: (v: boolean) => _loaded.set(v),
    _setIsSignedIn: (v: boolean) => _isSignedIn.set(v),
  };
}

describe('ClerkLoadedComponent', () => {
  let mockService: ReturnType<typeof createMockClerkService>;

  @Component({
    standalone: true,
    imports: [ClerkLoadedComponent],
    template: `<clerk-loaded>Loaded Content</clerk-loaded>`,
  })
  class TestHost {}

  beforeEach(() => {
    TestBed.resetTestingModule();
    mockService = createMockClerkService();
    TestBed.configureTestingModule({
      imports: [TestHost],
      providers: [
        { provide: ClerkService, useValue: mockService },
        { provide: CLERK_OPTIONS, useValue: { publishableKey: 'pk_test' } },
      ],
    });
  });

  it('should hide content when not loaded', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent.trim()).toBe('');
  });

  it('should project content when loaded', () => {
    mockService._setLoaded(true);
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Loaded Content');
  });
});

describe('ClerkLoadingComponent', () => {
  let mockService: ReturnType<typeof createMockClerkService>;

  @Component({
    standalone: true,
    imports: [ClerkLoadingComponent],
    template: `<clerk-loading>Loading...</clerk-loading>`,
  })
  class TestHost {}

  beforeEach(() => {
    TestBed.resetTestingModule();
    mockService = createMockClerkService();
    TestBed.configureTestingModule({
      imports: [TestHost],
      providers: [
        { provide: ClerkService, useValue: mockService },
        { provide: CLERK_OPTIONS, useValue: { publishableKey: 'pk_test' } },
      ],
    });
  });

  it('should project content when not loaded', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Loading...');
  });

  it('should hide content when loaded', () => {
    mockService._setLoaded(true);
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent.trim()).toBe('');
  });
});

describe('SignedInComponent', () => {
  let mockService: ReturnType<typeof createMockClerkService>;

  @Component({
    standalone: true,
    imports: [SignedInComponent],
    template: `<clerk-signed-in>Welcome!</clerk-signed-in>`,
  })
  class TestHost {}

  beforeEach(() => {
    TestBed.resetTestingModule();
    mockService = createMockClerkService();
    TestBed.configureTestingModule({
      imports: [TestHost],
      providers: [
        { provide: ClerkService, useValue: mockService },
        { provide: CLERK_OPTIONS, useValue: { publishableKey: 'pk_test' } },
      ],
    });
  });

  it('should project content when loaded and signed in', () => {
    mockService._setLoaded(true);
    mockService._setIsSignedIn(true);
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Welcome!');
  });

  it('should hide content when not loaded', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent.trim()).toBe('');
  });

  it('should hide content when loaded but not signed in', () => {
    mockService._setLoaded(true);
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent.trim()).toBe('');
  });
});

describe('SignedOutComponent', () => {
  let mockService: ReturnType<typeof createMockClerkService>;

  @Component({
    standalone: true,
    imports: [SignedOutComponent],
    template: `<clerk-signed-out>Please sign in</clerk-signed-out>`,
  })
  class TestHost {}

  beforeEach(() => {
    TestBed.resetTestingModule();
    mockService = createMockClerkService();
    TestBed.configureTestingModule({
      imports: [TestHost],
      providers: [
        { provide: ClerkService, useValue: mockService },
        { provide: CLERK_OPTIONS, useValue: { publishableKey: 'pk_test' } },
      ],
    });
  });

  it('should project content when loaded and not signed in', () => {
    mockService._setLoaded(true);
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Please sign in');
  });

  it('should hide content when not loaded', () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent.trim()).toBe('');
  });

  it('should hide content when loaded and signed in', () => {
    mockService._setLoaded(true);
    mockService._setIsSignedIn(true);
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent.trim()).toBe('');
  });
});
