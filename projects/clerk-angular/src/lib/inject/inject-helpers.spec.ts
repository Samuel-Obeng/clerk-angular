import { TestBed } from '@angular/core/testing';
import { signal, computed } from '@angular/core';
import { ClerkService } from '../clerk.service';
import { CLERK_OPTIONS } from '../clerk.tokens';
import { injectClerk } from './inject-clerk';
import { injectAuth } from './inject-auth';
import { injectUser } from './inject-user';
import { injectSession } from './inject-session';
import { injectOrganization } from './inject-organization';

function createMockClerkService() {
  const clerkSig = signal('mock-clerk-instance');
  const authSig = computed(() => ({ userId: 'user_123' }));
  const userSig = signal({ id: 'user_123', firstName: 'Test' });
  const sessionSig = signal({ id: 'sess_123' });
  const orgSig = signal({ id: 'org_123', name: 'Test Org' });

  return {
    clerk: clerkSig.asReadonly(),
    auth: authSig,
    user: userSig.asReadonly(),
    session: sessionSig.asReadonly(),
    organization: orgSig.asReadonly(),
  };
}

describe('inject helpers', () => {
  let mockService: ReturnType<typeof createMockClerkService>;

  beforeEach(() => {
    TestBed.resetTestingModule();
    mockService = createMockClerkService();
    TestBed.configureTestingModule({
      providers: [
        { provide: ClerkService, useValue: mockService },
        { provide: CLERK_OPTIONS, useValue: { publishableKey: 'pk_test' } },
      ],
    });
  });

  it('injectClerk should return the clerk signal', () => {
    const result = TestBed.runInInjectionContext(() => injectClerk());
    expect(result).toBe(mockService.clerk);
    expect(result()).toBe('mock-clerk-instance');
  });

  it('injectAuth should return the auth signal', () => {
    const result = TestBed.runInInjectionContext(() => injectAuth());
    expect(result).toBe(mockService.auth);
    expect(result().userId).toBe('user_123');
  });

  it('injectUser should return the user signal', () => {
    const result = TestBed.runInInjectionContext(() => injectUser());
    expect(result).toBe(mockService.user);
    expect(result()).toEqual({ id: 'user_123', firstName: 'Test' });
  });

  it('injectSession should return the session signal', () => {
    const result = TestBed.runInInjectionContext(() => injectSession());
    expect(result).toBe(mockService.session);
    expect(result()).toEqual({ id: 'sess_123' });
  });

  it('injectOrganization should return the organization signal', () => {
    const result = TestBed.runInInjectionContext(() => injectOrganization());
    expect(result).toBe(mockService.organization);
    expect(result()).toEqual({ id: 'org_123', name: 'Test Org' });
  });
});
