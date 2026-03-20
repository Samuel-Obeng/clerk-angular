import {
  Injectable,
  Injector,
  computed,
  inject,
  signal,
  runInInjectionContext,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { loadClerkJSScript, loadClerkUIScript } from '@clerk/shared/loadClerkJsScript';
import { deriveState } from '@clerk/shared/deriveState';
import type {
  ClientResource,
  OrganizationResource,
  SessionResource,
  UserResource,
} from '@clerk/types';
import { CLERK_OPTIONS } from './clerk.tokens';

interface ClerkResources {
  client: ClientResource | undefined;
  session: SessionResource | null | undefined;
  user: UserResource | null | undefined;
  organization: OrganizationResource | null | undefined;
}

/**
 * Core service that manages the Clerk instance lifecycle and exposes
 * authentication state as Angular signals.
 *
 * Prefer the shorthand inject helpers ({@link injectAuth}, {@link injectUser}, etc.)
 * for reading state in components. Use this service directly when you need
 * methods like {@link getToken}, {@link signOut}, or {@link openSignIn}.
 */
@Injectable()
export class ClerkService {
  private readonly options = inject(CLERK_OPTIONS);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly injector = inject(Injector);

  private readonly _loaded = signal(false);
  private readonly _clerk = signal<any>(null);
  private readonly _resources = signal<ClerkResources>({
    client: undefined,
    session: undefined,
    user: undefined,
    organization: undefined,
  });

  private readonly derivedState = computed(() =>
    deriveState(this._loaded(), this._resources() as any, this.options.initialState as any),
  );

  readonly loaded = this._loaded.asReadonly();
  readonly clerk = this._clerk.asReadonly();

  readonly user = computed(() => this.derivedState().user ?? null);
  readonly session = computed(() => this.derivedState().session ?? null);
  readonly organization = computed(() => this.derivedState().organization ?? null);
  readonly client = computed(() => this._resources().client ?? null);

  readonly auth = computed(() => {
    const state = this.derivedState();
    return {
      userId: state.userId ?? null,
      sessionId: state.sessionId ?? null,
      sessionStatus: state.sessionStatus,
      orgId: state.orgId ?? null,
      orgRole: state.orgRole ?? null,
      orgSlug: state.orgSlug ?? null,
      orgPermissions: state.orgPermissions ?? null,
      actor: state.actor ?? null,
      sessionClaims: state.sessionClaims ?? null,
      factorVerificationAge: state.factorVerificationAge ?? null,
    };
  });

  readonly isSignedIn = computed(() => !!this.auth().userId);
  readonly isLoaded = this.loaded;

  /** Loads the Clerk JS scripts and initialises the Clerk instance. Called automatically by `APP_INITIALIZER`. */
  async init(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const { publishableKey, clerkJSUrl, clerkJSVersion, proxyUrl, domain, nonce } = this.options;

    const scriptOpts: any = {
      publishableKey,
      __internal_clerkJSUrl: clerkJSUrl,
      __internal_clerkJSVersion: clerkJSVersion,
      proxyUrl,
      domain: typeof domain === 'string' ? domain : undefined,
      nonce,
      sdkMetadata: this.options.sdkMetadata ?? {
        name: 'clerk-angular',
        version: '0.0.1',
      },
    };

    // Load both Clerk JS (headless) and Clerk UI (components) scripts
    await Promise.all([
      loadClerkJSScript(scriptOpts),
      loadClerkUIScript(scriptOpts),
    ]);

    const clerkInstance = (window as any).Clerk;
    if (!clerkInstance) {
      throw new Error('Failed to load Clerk');
    }

    this._clerk.set(clerkInstance);

    // Pass the UI constructor to clerk.load() so mount methods work
    const ClerkUICtor = (window as any).__internal_ClerkUICtor;

    await clerkInstance.load({
      appearance: this.options.appearance,
      localization: this.options.localization,
      signInUrl: this.options.signInUrl,
      signUpUrl: this.options.signUpUrl,
      signInForceRedirectUrl: this.options.signInForceRedirectUrl,
      signUpForceRedirectUrl: this.options.signUpForceRedirectUrl,
      signInFallbackRedirectUrl: this.options.signInFallbackRedirectUrl,
      signUpFallbackRedirectUrl: this.options.signUpFallbackRedirectUrl,
      afterSignOutUrl: this.options.afterSignOutUrl,
      supportEmail: this.options.supportEmail,
      allowedRedirectOrigins: this.options.allowedRedirectOrigins,
      isSatellite: this.options.isSatellite,
      sdkMetadata: this.options.sdkMetadata ?? {
        name: 'clerk-angular',
        version: '0.0.1',
      },
      routerPush: (to: string) => this.navigateTo(to),
      routerReplace: (to: string) => this.navigateTo(to, true),
      ...(ClerkUICtor ? { ui: { ClerkUI: ClerkUICtor } } : {}),
    });

    this._loaded.set(true);

    clerkInstance.addListener((payload: any) => {
      this._resources.set({
        client: payload.client,
        session: payload.session,
        user: payload.user,
        organization: payload.organization,
      });
    });
  }

  /** Returns a session token, or `null` if no active session exists. */
  async getToken(options?: { template?: string; leewayInSeconds?: number }): Promise<string | null> {
    const session = this.session();
    if (!session) return null;
    return (session as any).getToken(options);
  }

  /** Signs the user out and optionally redirects. */
  async signOut(options?: { redirectUrl?: string; sessionId?: string }): Promise<void> {
    const clerk = this._clerk();
    if (!clerk) return;
    await clerk.signOut(options);
  }

  /** Opens the Clerk sign-in modal. */
  openSignIn(props?: Record<string, unknown>): void {
    this._clerk()?.openSignIn(props);
  }

  /** Opens the Clerk sign-up modal. */
  openSignUp(props?: Record<string, unknown>): void {
    this._clerk()?.openSignUp(props);
  }

  /** Opens the Clerk user profile modal. */
  openUserProfile(props?: Record<string, unknown>): void {
    this._clerk()?.openUserProfile(props);
  }

  /** Opens the Clerk organization profile modal. */
  openOrganizationProfile(props?: Record<string, unknown>): void {
    this._clerk()?.openOrganizationProfile(props);
  }

  /** Opens the Clerk create-organization modal. */
  openCreateOrganization(props?: Record<string, unknown>): void {
    this._clerk()?.openCreateOrganization(props);
  }

  private navigateTo(to: string, replace = false): void {
    try {
      const router = runInInjectionContext(this.injector, () => inject(Router));
      if (replace) {
        router.navigateByUrl(to, { replaceUrl: true });
      } else {
        router.navigateByUrl(to);
      }
    } catch {
      if (replace) {
        window.location.replace(to);
      } else {
        window.location.href = to;
      }
    }
  }
}
