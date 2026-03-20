export function createMockClerkInstance(overrides: Record<string, unknown> = {}) {
  return {
    load: jest.fn().mockResolvedValue(undefined),
    addListener: jest.fn(),
    signOut: jest.fn().mockResolvedValue(undefined),
    openSignIn: jest.fn(),
    openSignUp: jest.fn(),
    openUserProfile: jest.fn(),
    openOrganizationProfile: jest.fn(),
    openCreateOrganization: jest.fn(),
    redirectToSignIn: jest.fn(),
    redirectToSignUp: jest.fn(),
    mountSignIn: jest.fn(),
    unmountSignIn: jest.fn(),
    mountSignUp: jest.fn(),
    unmountSignUp: jest.fn(),
    mountUserButton: jest.fn(),
    unmountUserButton: jest.fn(),
    mountUserProfile: jest.fn(),
    unmountUserProfile: jest.fn(),
    mountOrganizationSwitcher: jest.fn(),
    unmountOrganizationSwitcher: jest.fn(),
    mountOrganizationProfile: jest.fn(),
    unmountOrganizationProfile: jest.fn(),
    mountOrganizationList: jest.fn(),
    unmountOrganizationList: jest.fn(),
    mountCreateOrganization: jest.fn(),
    unmountCreateOrganization: jest.fn(),
    openGoogleOneTap: jest.fn(),
    closeGoogleOneTap: jest.fn(),
    mountWaitlist: jest.fn(),
    unmountWaitlist: jest.fn(),
    mountPricingTable: jest.fn(),
    unmountPricingTable: jest.fn(),
    ...overrides,
  };
}

export function createMockSession(overrides: Record<string, unknown> = {}) {
  return {
    id: 'sess_test123',
    status: 'active',
    getToken: jest.fn().mockResolvedValue('mock-token-123'),
    ...overrides,
  };
}

export function createAuthenticatedState() {
  return {
    userId: 'user_test123',
    sessionId: 'sess_test123',
    sessionStatus: 'active',
    orgId: 'org_test123',
    orgRole: 'org:admin',
    orgSlug: 'test-org',
    orgPermissions: ['org:members:manage', 'org:billing:manage'],
    actor: null,
    sessionClaims: { sub: 'user_test123' },
    factorVerificationAge: null,
  };
}

export function createUnauthenticatedState() {
  return {
    userId: null,
    sessionId: null,
    sessionStatus: undefined,
    orgId: null,
    orgRole: null,
    orgSlug: null,
    orgPermissions: null,
    actor: null,
    sessionClaims: null,
    factorVerificationAge: null,
  };
}
