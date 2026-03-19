import { InjectionToken } from '@angular/core';

export interface ClerkProviderOptions {
  publishableKey: string;
  initialState?: unknown;
  sdkMetadata?: {
    name: string;
    version: string;
    environment?: string;
  };
  appearance?: Record<string, unknown>;
  localization?: Record<string, unknown>;
  signInUrl?: string;
  signUpUrl?: string;
  signInForceRedirectUrl?: string;
  signUpForceRedirectUrl?: string;
  signInFallbackRedirectUrl?: string;
  signUpFallbackRedirectUrl?: string;
  afterSignOutUrl?: string;
  clerkJSUrl?: string;
  clerkJSVersion?: string;
  supportEmail?: string;
  allowedRedirectOrigins?: Array<string | RegExp>;
  isSatellite?: boolean | ((url: URL) => boolean);
  domain?: string | ((url: URL) => string);
  proxyUrl?: string;
  nonce?: string;
}

export const CLERK_OPTIONS = new InjectionToken<ClerkProviderOptions>('CLERK_OPTIONS');
