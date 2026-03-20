import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ClerkService } from '../clerk.service';
import { CLERK_OPTIONS } from '../clerk.tokens';
import { clerkAuthGuard } from './clerk-auth.guard';
import { createAuthenticatedState, createUnauthenticatedState } from '../../__mocks__/clerk-test-utils';
import { signal, computed } from '@angular/core';

function createMockClerkService(overrides: Record<string, unknown> = {}) {
  const _loaded = signal(false);
  const _auth = signal(createUnauthenticatedState());

  return {
    loaded: _loaded.asReadonly(),
    auth: computed(() => _auth()),
    _setLoaded: (val: boolean) => _loaded.set(val),
    _setAuth: (val: any) => _auth.set(val),
    ...overrides,
  };
}

function setup(guardOptions?: Parameters<typeof clerkAuthGuard>[0]) {
  const mockService = createMockClerkService();
  const mockRouter = {
    createUrlTree: jest.fn((segments: string[]) => ({ toString: () => segments.join('/') } as unknown as UrlTree)),
  };

  TestBed.configureTestingModule({
    providers: [
      { provide: ClerkService, useValue: mockService },
      { provide: Router, useValue: mockRouter },
      { provide: CLERK_OPTIONS, useValue: { publishableKey: 'pk_test' } },
    ],
  });

  const guard = TestBed.runInInjectionContext(() => clerkAuthGuard(guardOptions));

  return { guard, mockService, mockRouter };
}

describe('clerkAuthGuard', () => {
  beforeEach(() => {
    TestBed.resetTestingModule();
    jest.useFakeTimers();
  });
  afterEach(() => jest.useRealTimers());

  describe('when loaded', () => {
    it('should return true for authenticated user', () => {
      const { guard, mockService } = setup();
      mockService._setLoaded(true);
      mockService._setAuth(createAuthenticatedState());

      const result = TestBed.runInInjectionContext(() => guard({} as any, {} as any));
      expect(result).toBe(true);
    });

    it('should return UrlTree for unauthenticated user', () => {
      const { guard, mockService, mockRouter } = setup();
      mockService._setLoaded(true);

      const result = TestBed.runInInjectionContext(() => guard({} as any, {} as any));
      expect(mockRouter.createUrlTree).toHaveBeenCalledWith(['/sign-in']);
      expect(result).not.toBe(true);
    });

    it('should use custom signInUrl', () => {
      const { guard, mockService, mockRouter } = setup({ signInUrl: '/login' });
      mockService._setLoaded(true);

      TestBed.runInInjectionContext(() => guard({} as any, {} as any));
      expect(mockRouter.createUrlTree).toHaveBeenCalledWith(['/login']);
    });

    it('should return true when orgRole matches', () => {
      const { guard, mockService } = setup({ orgRole: 'org:admin' });
      mockService._setLoaded(true);
      mockService._setAuth(createAuthenticatedState());

      const result = TestBed.runInInjectionContext(() => guard({} as any, {} as any));
      expect(result).toBe(true);
    });

    it('should return UrlTree when orgRole does not match', () => {
      const { guard, mockService, mockRouter } = setup({ orgRole: 'org:member' });
      mockService._setLoaded(true);
      mockService._setAuth(createAuthenticatedState());

      const result = TestBed.runInInjectionContext(() => guard({} as any, {} as any));
      expect(mockRouter.createUrlTree).toHaveBeenCalledWith(['/sign-in']);
      expect(result).not.toBe(true);
    });

    it('should return true when orgPermission matches', () => {
      const { guard, mockService } = setup({ orgPermission: 'org:members:manage' });
      mockService._setLoaded(true);
      mockService._setAuth(createAuthenticatedState());

      const result = TestBed.runInInjectionContext(() => guard({} as any, {} as any));
      expect(result).toBe(true);
    });

    it('should return UrlTree when orgPermission does not match', () => {
      const { guard, mockService, mockRouter } = setup({ orgPermission: 'org:admin:delete' });
      mockService._setLoaded(true);
      mockService._setAuth(createAuthenticatedState());

      const result = TestBed.runInInjectionContext(() => guard({} as any, {} as any));
      expect(mockRouter.createUrlTree).toHaveBeenCalledWith(['/sign-in']);
      expect(result).not.toBe(true);
    });
  });

  describe('when not loaded', () => {
    it('should return an Observable', () => {
      const { guard, mockService } = setup();

      const result = TestBed.runInInjectionContext(() => guard({} as any, {} as any));
      expect(result).toBeInstanceOf(Observable);
    });

    it('should emit after polling detects loaded', (done) => {
      jest.useRealTimers();
      const { guard, mockService } = setup();
      mockService._setAuth(createAuthenticatedState());

      const result = TestBed.runInInjectionContext(() => guard({} as any, {} as any));
      expect(result).toBeInstanceOf(Observable);

      (result as Observable<any>).subscribe((value) => {
        expect(value).toBe(true);
        done();
      });

      // Simulate loaded becoming true after a delay
      setTimeout(() => mockService._setLoaded(true), 100);
    });
  });
});
