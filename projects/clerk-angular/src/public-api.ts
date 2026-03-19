// Tokens
export { CLERK_OPTIONS, type ClerkProviderOptions } from './lib/clerk.tokens';

// Service
export { ClerkService } from './lib/clerk.service';

// Provider
export { provideClerk } from './lib/clerk.provider';

// Inject helpers
export { injectClerk, injectAuth, injectUser, injectSession, injectOrganization } from './lib/inject';

// UI Components
export { ClerkPortalComponent } from './lib/components/ui/clerk-portal.component';
export { SignInComponent } from './lib/components/ui/sign-in.component';
export { SignUpComponent } from './lib/components/ui/sign-up.component';
export { UserButtonComponent } from './lib/components/ui/user-button.component';
export { UserProfileComponent } from './lib/components/ui/user-profile.component';

// Control Components
export { ClerkLoadedComponent } from './lib/components/control/clerk-loaded.component';
export { ClerkLoadingComponent } from './lib/components/control/clerk-loading.component';
export { SignedInComponent } from './lib/components/control/signed-in.component';
export { SignedOutComponent } from './lib/components/control/signed-out.component';

// Button Components
export { SignInButtonComponent } from './lib/components/buttons/sign-in-button.component';
export { SignUpButtonComponent } from './lib/components/buttons/sign-up-button.component';
export { SignOutButtonComponent } from './lib/components/buttons/sign-out-button.component';

// Guards
export { clerkAuthGuard, type ClerkAuthGuardOptions } from './lib/guards/clerk-auth.guard';

// Interceptors
export { clerkTokenInterceptor } from './lib/interceptors/clerk-token.interceptor';
