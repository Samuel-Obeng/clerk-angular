import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { ClerkService } from '../../clerk.service';
import { CLERK_OPTIONS } from '../../clerk.tokens';
import { SignInButtonComponent } from './sign-in-button.component';
import { SignUpButtonComponent } from './sign-up-button.component';
import { SignOutButtonComponent } from './sign-out-button.component';
import { createMockClerkInstance } from '../../../__mocks__/clerk-test-utils';

function createMockClerkService(clerkInstance: any = null) {
  const _clerk = signal(clerkInstance);
  return {
    clerk: _clerk.asReadonly(),
    signOut: jest.fn().mockResolvedValue(undefined),
    _setClerk: (v: any) => _clerk.set(v),
  };
}

describe('SignInButtonComponent', () => {
  let mockService: ReturnType<typeof createMockClerkService>;
  let mockClerk: ReturnType<typeof createMockClerkInstance>;

  beforeEach(() => {
    TestBed.resetTestingModule();
    mockClerk = createMockClerkInstance();
    mockService = createMockClerkService(mockClerk);
    TestBed.configureTestingModule({
      imports: [SignInButtonComponent],
      providers: [
        { provide: ClerkService, useValue: mockService },
        { provide: CLERK_OPTIONS, useValue: { publishableKey: 'pk_test' } },
      ],
    });
  });

  it('should call openSignIn in modal mode', () => {
    const fixture = TestBed.createComponent(SignInButtonComponent);
    fixture.componentInstance.mode = 'modal';
    fixture.detectChanges();

    fixture.componentInstance.handleClick();
    expect(mockClerk.openSignIn).toHaveBeenCalled();
  });

  it('should call redirectToSignIn in redirect mode', () => {
    const fixture = TestBed.createComponent(SignInButtonComponent);
    fixture.componentInstance.mode = 'redirect';
    fixture.detectChanges();

    fixture.componentInstance.handleClick();
    expect(mockClerk.redirectToSignIn).toHaveBeenCalled();
  });

  it('should call redirectToSignIn by default (no mode)', () => {
    const fixture = TestBed.createComponent(SignInButtonComponent);
    fixture.detectChanges();

    fixture.componentInstance.handleClick();
    expect(mockClerk.redirectToSignIn).toHaveBeenCalled();
  });

  it('should pass URL props to openSignIn', () => {
    const fixture = TestBed.createComponent(SignInButtonComponent);
    fixture.componentInstance.mode = 'modal';
    fixture.componentInstance.forceRedirectUrl = '/dashboard';
    fixture.componentInstance.fallbackRedirectUrl = '/home';
    fixture.detectChanges();

    fixture.componentInstance.handleClick();
    expect(mockClerk.openSignIn).toHaveBeenCalledWith(
      expect.objectContaining({
        forceRedirectUrl: '/dashboard',
        fallbackRedirectUrl: '/home',
      }),
    );
  });

  it('should pass URL props to redirectToSignIn', () => {
    const fixture = TestBed.createComponent(SignInButtonComponent);
    fixture.componentInstance.forceRedirectUrl = '/dashboard';
    fixture.detectChanges();

    fixture.componentInstance.handleClick();
    expect(mockClerk.redirectToSignIn).toHaveBeenCalledWith(
      expect.objectContaining({
        forceRedirectUrl: '/dashboard',
      }),
    );
  });

  it('should not throw when clerk is null', () => {
    mockService._setClerk(null);
    const fixture = TestBed.createComponent(SignInButtonComponent);
    fixture.detectChanges();

    expect(() => fixture.componentInstance.handleClick()).not.toThrow();
  });
});

describe('SignUpButtonComponent', () => {
  let mockService: ReturnType<typeof createMockClerkService>;
  let mockClerk: ReturnType<typeof createMockClerkInstance>;

  beforeEach(() => {
    TestBed.resetTestingModule();
    mockClerk = createMockClerkInstance();
    mockService = createMockClerkService(mockClerk);
    TestBed.configureTestingModule({
      imports: [SignUpButtonComponent],
      providers: [
        { provide: ClerkService, useValue: mockService },
        { provide: CLERK_OPTIONS, useValue: { publishableKey: 'pk_test' } },
      ],
    });
  });

  it('should call openSignUp in modal mode', () => {
    const fixture = TestBed.createComponent(SignUpButtonComponent);
    fixture.componentInstance.mode = 'modal';
    fixture.detectChanges();

    fixture.componentInstance.handleClick();
    expect(mockClerk.openSignUp).toHaveBeenCalled();
  });

  it('should call redirectToSignUp in redirect mode', () => {
    const fixture = TestBed.createComponent(SignUpButtonComponent);
    fixture.componentInstance.mode = 'redirect';
    fixture.detectChanges();

    fixture.componentInstance.handleClick();
    expect(mockClerk.redirectToSignUp).toHaveBeenCalled();
  });

  it('should call redirectToSignUp by default', () => {
    const fixture = TestBed.createComponent(SignUpButtonComponent);
    fixture.detectChanges();

    fixture.componentInstance.handleClick();
    expect(mockClerk.redirectToSignUp).toHaveBeenCalled();
  });

  it('should pass URL props to openSignUp', () => {
    const fixture = TestBed.createComponent(SignUpButtonComponent);
    fixture.componentInstance.mode = 'modal';
    fixture.componentInstance.forceRedirectUrl = '/welcome';
    fixture.componentInstance.signInForceRedirectUrl = '/login-redirect';
    fixture.detectChanges();

    fixture.componentInstance.handleClick();
    expect(mockClerk.openSignUp).toHaveBeenCalledWith(
      expect.objectContaining({
        forceRedirectUrl: '/welcome',
        signInForceRedirectUrl: '/login-redirect',
      }),
    );
  });

  it('should not throw when clerk is null', () => {
    mockService._setClerk(null);
    const fixture = TestBed.createComponent(SignUpButtonComponent);
    fixture.detectChanges();

    expect(() => fixture.componentInstance.handleClick()).not.toThrow();
  });
});

describe('SignOutButtonComponent', () => {
  let mockService: ReturnType<typeof createMockClerkService>;

  beforeEach(() => {
    TestBed.resetTestingModule();
    mockService = createMockClerkService();
    TestBed.configureTestingModule({
      imports: [SignOutButtonComponent],
      providers: [
        { provide: ClerkService, useValue: mockService },
        { provide: CLERK_OPTIONS, useValue: { publishableKey: 'pk_test' } },
      ],
    });
  });

  it('should call clerkService.signOut with options', () => {
    const fixture = TestBed.createComponent(SignOutButtonComponent);
    fixture.componentInstance.redirectUrl = '/goodbye';
    fixture.componentInstance.sessionId = 'sess_123';
    fixture.detectChanges();

    fixture.componentInstance.handleClick();
    expect(mockService.signOut).toHaveBeenCalledWith({
      redirectUrl: '/goodbye',
      sessionId: 'sess_123',
    });
  });

  it('should call signOut with undefined props when not set', () => {
    const fixture = TestBed.createComponent(SignOutButtonComponent);
    fixture.detectChanges();

    fixture.componentInstance.handleClick();
    expect(mockService.signOut).toHaveBeenCalledWith({
      redirectUrl: undefined,
      sessionId: undefined,
    });
  });
});
