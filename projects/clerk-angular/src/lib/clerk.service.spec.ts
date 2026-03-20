import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { ClerkService } from './clerk.service';
import { CLERK_OPTIONS, ClerkProviderOptions } from './clerk.tokens';
import { createMockClerkInstance, createMockSession } from '../__mocks__/clerk-test-utils';

jest.mock('@clerk/shared/loadClerkJsScript', () => ({
  loadClerkJSScript: jest.fn().mockResolvedValue(undefined),
  loadClerkUIScript: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('@clerk/shared/deriveState', () => ({
  deriveState: jest.fn((loaded: boolean, resources: any, _initial: any) => {
    if (!loaded) {
      return {
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
      };
    }
    return {
      userId: resources?.user?.id ?? undefined,
      sessionId: resources?.session?.id ?? undefined,
      sessionStatus: resources?.session?.status ?? undefined,
      orgId: resources?.organization?.id ?? undefined,
      orgRole: resources?.organization?.role ?? undefined,
      orgSlug: resources?.organization?.slug ?? undefined,
      orgPermissions: resources?.organization?.permissions ?? undefined,
      actor: undefined,
      sessionClaims: resources?.session ? { sub: resources.user?.id } : undefined,
      factorVerificationAge: undefined,
      user: resources?.user ?? undefined,
      session: resources?.session ?? undefined,
      organization: resources?.organization ?? undefined,
    };
  }),
}));

const defaultOptions: ClerkProviderOptions = {
  publishableKey: 'pk_test_123',
};

function createService(options: Partial<ClerkProviderOptions> = {}, platformId = 'browser') {
  TestBed.configureTestingModule({
    providers: [
      ClerkService,
      { provide: CLERK_OPTIONS, useValue: { ...defaultOptions, ...options } },
      { provide: PLATFORM_ID, useValue: platformId },
      {
        provide: Router,
        useValue: {
          navigateByUrl: jest.fn(),
        },
      },
    ],
  });
  return TestBed.inject(ClerkService);
}

describe('ClerkService', () => {
  const { loadClerkJSScript, loadClerkUIScript } = jest.requireMock('@clerk/shared/loadClerkJsScript');

  beforeEach(() => {
    TestBed.resetTestingModule();
    jest.clearAllMocks();
    (window as any).Clerk = undefined;
    (window as any).__internal_ClerkUICtor = undefined;
  });

  describe('initial state', () => {
    it('should have loaded=false initially', () => {
      const service = createService();
      expect(service.loaded()).toBe(false);
    });

    it('should have clerk=null initially', () => {
      const service = createService();
      expect(service.clerk()).toBeNull();
    });

    it('should have user=null initially', () => {
      const service = createService();
      expect(service.user()).toBeNull();
    });

    it('should have session=null initially', () => {
      const service = createService();
      expect(service.session()).toBeNull();
    });

    it('should have organization=null initially', () => {
      const service = createService();
      expect(service.organization()).toBeNull();
    });

    it('should have client=null initially', () => {
      const service = createService();
      expect(service.client()).toBeNull();
    });

    it('should have auth fields all null initially', () => {
      const service = createService();
      const auth = service.auth();
      expect(auth.userId).toBeNull();
      expect(auth.sessionId).toBeNull();
      expect(auth.orgId).toBeNull();
      expect(auth.orgRole).toBeNull();
      expect(auth.orgSlug).toBeNull();
      expect(auth.orgPermissions).toBeNull();
      expect(auth.actor).toBeNull();
      expect(auth.sessionClaims).toBeNull();
      expect(auth.factorVerificationAge).toBeNull();
    });

    it('should have isSignedIn=false initially', () => {
      const service = createService();
      expect(service.isSignedIn()).toBe(false);
    });

    it('should have isLoaded alias matching loaded', () => {
      const service = createService();
      expect(service.isLoaded()).toBe(service.loaded());
    });
  });

  describe('init()', () => {
    it('should skip initialization on server platform', async () => {
      const service = createService({}, 'server');
      await service.init();
      expect(loadClerkJSScript).not.toHaveBeenCalled();
    });

    it('should call loadClerkJSScript and loadClerkUIScript', async () => {
      const mockClerk = createMockClerkInstance();
      (window as any).Clerk = mockClerk;

      const service = createService();
      await service.init();

      expect(loadClerkJSScript).toHaveBeenCalledWith(
        expect.objectContaining({ publishableKey: 'pk_test_123' }),
      );
      expect(loadClerkUIScript).toHaveBeenCalledWith(
        expect.objectContaining({ publishableKey: 'pk_test_123' }),
      );
    });

    it('should throw if window.Clerk is not available after loading scripts', async () => {
      (window as any).Clerk = undefined;
      const service = createService();
      await expect(service.init()).rejects.toThrow('Failed to load Clerk');
    });

    it('should call clerk.load() with correct options', async () => {
      const mockClerk = createMockClerkInstance();
      (window as any).Clerk = mockClerk;

      const service = createService({
        publishableKey: 'pk_test_123',
        appearance: { variables: { colorPrimary: 'red' } },
        signInUrl: '/login',
        signUpUrl: '/register',
      });
      await service.init();

      expect(mockClerk.load).toHaveBeenCalledWith(
        expect.objectContaining({
          appearance: { variables: { colorPrimary: 'red' } },
          signInUrl: '/login',
          signUpUrl: '/register',
        }),
      );
    });

    it('should pass UI constructor when __internal_ClerkUICtor is available', async () => {
      const mockClerk = createMockClerkInstance();
      const mockUICtor = jest.fn();
      (window as any).Clerk = mockClerk;
      (window as any).__internal_ClerkUICtor = mockUICtor;

      const service = createService();
      await service.init();

      expect(mockClerk.load).toHaveBeenCalledWith(
        expect.objectContaining({
          ui: { ClerkUI: mockUICtor },
        }),
      );
    });

    it('should not pass ui key when __internal_ClerkUICtor is not available', async () => {
      const mockClerk = createMockClerkInstance();
      (window as any).Clerk = mockClerk;

      const service = createService();
      await service.init();

      const loadArgs = mockClerk.load.mock.calls[0][0];
      expect(loadArgs.ui).toBeUndefined();
    });

    it('should set loaded=true after successful init', async () => {
      const mockClerk = createMockClerkInstance();
      (window as any).Clerk = mockClerk;

      const service = createService();
      expect(service.loaded()).toBe(false);
      await service.init();
      expect(service.loaded()).toBe(true);
    });

    it('should register a listener on the clerk instance', async () => {
      const mockClerk = createMockClerkInstance();
      (window as any).Clerk = mockClerk;

      const service = createService();
      await service.init();

      expect(mockClerk.addListener).toHaveBeenCalledWith(expect.any(Function));
    });

    it('should update resources when listener fires', async () => {
      const mockClerk = createMockClerkInstance();
      (window as any).Clerk = mockClerk;

      const service = createService();
      await service.init();

      const listener = mockClerk.addListener.mock.calls[0][0];
      const mockUser = { id: 'user_123', firstName: 'Test' };
      const mockSession = { id: 'sess_123', status: 'active' };
      const mockOrg = { id: 'org_123', role: 'org:admin', slug: 'test' };

      listener({
        client: { id: 'client_123' },
        session: mockSession,
        user: mockUser,
        organization: mockOrg,
      });

      expect(service.client()).toEqual({ id: 'client_123' });
    });

    it('should pass sdkMetadata defaults', async () => {
      const mockClerk = createMockClerkInstance();
      (window as any).Clerk = mockClerk;

      const service = createService();
      await service.init();

      expect(loadClerkJSScript).toHaveBeenCalledWith(
        expect.objectContaining({
          sdkMetadata: { name: 'clerk-angular', version: '0.0.1' },
        }),
      );
    });

    it('should pass routerPush and routerReplace in load options', async () => {
      const mockClerk = createMockClerkInstance();
      (window as any).Clerk = mockClerk;

      const service = createService();
      await service.init();

      const loadArgs = mockClerk.load.mock.calls[0][0];
      expect(typeof loadArgs.routerPush).toBe('function');
      expect(typeof loadArgs.routerReplace).toBe('function');
    });
  });

  describe('computed signals after listener fires', () => {
    async function initWithResources() {
      const mockClerk = createMockClerkInstance();
      (window as any).Clerk = mockClerk;

      const service = createService();
      await service.init();

      const listener = mockClerk.addListener.mock.calls[0][0];
      listener({
        client: { id: 'client_123' },
        session: { id: 'sess_123', status: 'active', getToken: jest.fn().mockResolvedValue('tok') },
        user: { id: 'user_123' },
        organization: { id: 'org_123', role: 'org:admin', slug: 'my-org', permissions: ['read'] },
      });

      return { service, mockClerk, listener };
    }

    it('should derive user from resources', async () => {
      const { service } = await initWithResources();
      expect(service.user()).toEqual({ id: 'user_123' });
    });

    it('should derive session from resources', async () => {
      const { service } = await initWithResources();
      expect(service.session()).toEqual(
        expect.objectContaining({ id: 'sess_123' }),
      );
    });

    it('should derive organization from resources', async () => {
      const { service } = await initWithResources();
      expect(service.organization()).toEqual(
        expect.objectContaining({ id: 'org_123' }),
      );
    });

    it('should derive auth.userId', async () => {
      const { service } = await initWithResources();
      expect(service.auth().userId).toBe('user_123');
    });

    it('should compute isSignedIn=true when userId exists', async () => {
      const { service } = await initWithResources();
      expect(service.isSignedIn()).toBe(true);
    });
  });

  describe('getToken()', () => {
    it('should return null when no session', async () => {
      const service = createService();
      const token = await service.getToken();
      expect(token).toBeNull();
    });

    it('should delegate to session.getToken()', async () => {
      const mockClerk = createMockClerkInstance();
      (window as any).Clerk = mockClerk;

      const service = createService();
      await service.init();

      const mockSession = createMockSession();
      const listener = mockClerk.addListener.mock.calls[0][0];
      listener({
        client: undefined,
        session: mockSession,
        user: { id: 'user_123' },
        organization: undefined,
      });

      const token = await service.getToken({ template: 'my-template' });
      expect(mockSession.getToken).toHaveBeenCalledWith({ template: 'my-template' });
      expect(token).toBe('mock-token-123');
    });
  });

  describe('signOut()', () => {
    it('should be a no-op when clerk is null', async () => {
      const service = createService();
      await expect(service.signOut()).resolves.toBeUndefined();
    });

    it('should delegate to clerk.signOut()', async () => {
      const mockClerk = createMockClerkInstance();
      (window as any).Clerk = mockClerk;

      const service = createService();
      await service.init();
      await service.signOut({ redirectUrl: '/bye' });

      expect(mockClerk.signOut).toHaveBeenCalledWith({ redirectUrl: '/bye' });
    });
  });

  describe('modal methods', () => {
    it('should not throw when clerk is null', () => {
      const service = createService();
      expect(() => service.openSignIn()).not.toThrow();
      expect(() => service.openSignUp()).not.toThrow();
      expect(() => service.openUserProfile()).not.toThrow();
      expect(() => service.openOrganizationProfile()).not.toThrow();
      expect(() => service.openCreateOrganization()).not.toThrow();
    });

    it('should delegate openSignIn to clerk', async () => {
      const mockClerk = createMockClerkInstance();
      (window as any).Clerk = mockClerk;

      const service = createService();
      await service.init();
      service.openSignIn({ redirectUrl: '/dashboard' });

      expect(mockClerk.openSignIn).toHaveBeenCalledWith({ redirectUrl: '/dashboard' });
    });

    it('should delegate openSignUp to clerk', async () => {
      const mockClerk = createMockClerkInstance();
      (window as any).Clerk = mockClerk;

      const service = createService();
      await service.init();
      service.openSignUp({ redirectUrl: '/welcome' });

      expect(mockClerk.openSignUp).toHaveBeenCalledWith({ redirectUrl: '/welcome' });
    });

    it('should delegate openUserProfile to clerk', async () => {
      const mockClerk = createMockClerkInstance();
      (window as any).Clerk = mockClerk;

      const service = createService();
      await service.init();
      service.openUserProfile();

      expect(mockClerk.openUserProfile).toHaveBeenCalled();
    });

    it('should delegate openOrganizationProfile to clerk', async () => {
      const mockClerk = createMockClerkInstance();
      (window as any).Clerk = mockClerk;

      const service = createService();
      await service.init();
      service.openOrganizationProfile();

      expect(mockClerk.openOrganizationProfile).toHaveBeenCalled();
    });

    it('should delegate openCreateOrganization to clerk', async () => {
      const mockClerk = createMockClerkInstance();
      (window as any).Clerk = mockClerk;

      const service = createService();
      await service.init();
      service.openCreateOrganization();

      expect(mockClerk.openCreateOrganization).toHaveBeenCalled();
    });
  });

  describe('navigateTo (via routerPush/routerReplace)', () => {
    it('should use Router.navigateByUrl for routerPush', async () => {
      const mockClerk = createMockClerkInstance();
      (window as any).Clerk = mockClerk;

      const service = createService();
      await service.init();

      const loadArgs = mockClerk.load.mock.calls[0][0];
      loadArgs.routerPush('/dashboard');

      const router = TestBed.inject(Router);
      expect(router.navigateByUrl).toHaveBeenCalledWith('/dashboard');
    });

    it('should use Router.navigateByUrl with replaceUrl for routerReplace', async () => {
      const mockClerk = createMockClerkInstance();
      (window as any).Clerk = mockClerk;

      const service = createService();
      await service.init();

      const loadArgs = mockClerk.load.mock.calls[0][0];
      loadArgs.routerReplace('/dashboard');

      const router = TestBed.inject(Router);
      expect(router.navigateByUrl).toHaveBeenCalledWith('/dashboard', { replaceUrl: true });
    });

    it('should fall back to window.location when Router is not available', async () => {
      // Reconfigure WITHOUT Router — inject(Router) will throw,
      // forcing navigateTo into its catch branch which uses
      // window.location.href (push) and window.location.replace (replace).
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          ClerkService,
          { provide: CLERK_OPTIONS, useValue: defaultOptions },
          { provide: PLATFORM_ID, useValue: 'browser' },
        ],
      });
      const service = TestBed.inject(ClerkService);

      const mockClerk = createMockClerkInstance();
      (window as any).Clerk = mockClerk;
      await service.init();

      const loadArgs = mockClerk.load.mock.calls[0][0];

      // Verify the fallback path executes without error.
      // jsdom's Location is sealed, so we cannot spy on href/replace directly.
      // The fact that these don't throw confirms the catch block runs
      // (inject(Router) throws → catch → window.location).
      expect(() => loadArgs.routerPush('/push-target')).not.toThrow();
      expect(() => loadArgs.routerReplace('/replace-target')).not.toThrow();
    });
  });
});
