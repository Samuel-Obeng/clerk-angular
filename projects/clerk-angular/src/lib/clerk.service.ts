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
import { loadClerkJSScript } from '@clerk/shared/loadClerkJsScript';
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

  async init(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const { publishableKey, clerkJSUrl, clerkJSVersion, proxyUrl, domain, nonce } = this.options;

    await loadClerkJSScript({
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
    });

    const clerkInstance = (window as any).Clerk;
    if (!clerkInstance) {
      throw new Error('Failed to load Clerk');
    }

    this._clerk.set(clerkInstance);

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

  async getToken(options?: { template?: string; leewayInSeconds?: number }): Promise<string | null> {
    const session = this.session();
    if (!session) return null;
    return (session as any).getToken(options);
  }

  async signOut(options?: { redirectUrl?: string; sessionId?: string }): Promise<void> {
    const clerk = this._clerk();
    if (!clerk) return;
    await clerk.signOut(options);
  }

  openSignIn(props?: Record<string, unknown>): void {
    this._clerk()?.openSignIn(props);
  }

  openSignUp(props?: Record<string, unknown>): void {
    this._clerk()?.openSignUp(props);
  }

  openUserProfile(props?: Record<string, unknown>): void {
    this._clerk()?.openUserProfile(props);
  }

  openOrganizationProfile(props?: Record<string, unknown>): void {
    this._clerk()?.openOrganizationProfile(props);
  }

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
