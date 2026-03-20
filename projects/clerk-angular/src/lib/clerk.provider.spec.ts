import { TestBed } from '@angular/core/testing';
import { APP_INITIALIZER } from '@angular/core';
import { provideClerk } from './clerk.provider';
import { ClerkService } from './clerk.service';
import { CLERK_OPTIONS } from './clerk.tokens';

jest.mock('@clerk/shared/loadClerkJsScript', () => ({
  loadClerkJSScript: jest.fn().mockResolvedValue(undefined),
  loadClerkUIScript: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('@clerk/shared/deriveState', () => ({
  deriveState: jest.fn(() => ({
    userId: undefined,
    sessionId: undefined,
    sessionStatus: undefined,
    orgId: undefined,
    orgRole: undefined,
    orgSlug: undefined,
    orgPermissions: undefined,
    actor: undefined,
    sessionClaims: undefined,
    factorVerificationAge: undefined,
    user: undefined,
    session: undefined,
    organization: undefined,
  })),
}));

describe('provideClerk', () => {
  beforeEach(() => {
    TestBed.resetTestingModule();
    (window as any).Clerk = undefined;
  });

  it('should make ClerkService injectable', () => {
    TestBed.configureTestingModule({
      providers: [provideClerk({ publishableKey: 'pk_test_123' })],
    });

    const service = TestBed.inject(ClerkService);
    expect(service).toBeInstanceOf(ClerkService);
  });

  it('should provide CLERK_OPTIONS', () => {
    const options = { publishableKey: 'pk_test_456' };
    TestBed.configureTestingModule({
      providers: [provideClerk(options)],
    });

    const injectedOptions = TestBed.inject(CLERK_OPTIONS);
    expect(injectedOptions.publishableKey).toBe('pk_test_456');
  });

  it('should register APP_INITIALIZER that calls init()', () => {
    TestBed.configureTestingModule({
      providers: [provideClerk({ publishableKey: 'pk_test_789' })],
    });

    const service = TestBed.inject(ClerkService);
    const initSpy = jest.spyOn(service, 'init').mockResolvedValue(undefined);

    // APP_INITIALIZER is a multi-token; retrieve all registered initializers
    const initializers = TestBed.inject(APP_INITIALIZER);
    expect(Array.isArray(initializers)).toBe(true);

    // Find the initializer that calls ClerkService.init()
    const clerkInitializer = initializers.find((fn: any) => {
      fn();
      return initSpy.mock.calls.length > 0;
    });

    expect(clerkInitializer).toBeDefined();
    expect(initSpy).toHaveBeenCalled();
  });
});
