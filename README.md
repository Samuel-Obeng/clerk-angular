# clerk-angular

Angular SDK for [Clerk](https://clerk.com) authentication. Provides components, services, guards, and interceptors for integrating Clerk into Angular applications.

## Installation

```bash
npm install clerk-angular @clerk/shared @clerk/types
```

**Peer dependencies:** Angular 17+

## Quick Start

Add `provideClerk()` to your application config:

```typescript
// app.config.ts
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClerk } from 'clerk-angular';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClerk({
      publishableKey: 'pk_test_...',
    }),
  ],
};
```

## Usage

### Components

Use Clerk's prebuilt UI components as Angular elements:

```html
<!-- Full sign-in/sign-up pages -->
<clerk-sign-in />
<clerk-sign-up />

<!-- User menu button -->
<clerk-user-button />

<!-- Organization management -->
<clerk-organization-switcher />
<clerk-organization-profile />
```

### Control Components

Conditionally render content based on auth state:

```html
<clerk-loading>
  <p>Loading...</p>
</clerk-loading>

<clerk-loaded>
  <clerk-signed-in>
    <p>Welcome back!</p>
    <clerk-user-button />
  </clerk-signed-in>

  <clerk-signed-out>
    <clerk-sign-in-button mode="modal">
      <button>Sign in</button>
    </clerk-sign-in-button>
  </clerk-signed-out>
</clerk-loaded>
```

### Button Components

Trigger auth flows with button wrappers:

```html
<clerk-sign-in-button mode="modal">
  <button>Sign in</button>
</clerk-sign-in-button>

<clerk-sign-up-button mode="modal">
  <button>Sign up</button>
</clerk-sign-up-button>

<clerk-sign-out-button>
  <button>Sign out</button>
</clerk-sign-out-button>
```

### Inject Helpers

Access auth state reactively using Angular signals:

```typescript
import { Component } from '@angular/core';
import { injectAuth, injectUser } from 'clerk-angular';

@Component({ ... })
export class DashboardComponent {
  auth = injectAuth();
  user = injectUser();

  get firstName() {
    return this.user()?.firstName;
  }

  get isSignedIn() {
    return this.auth()?.userId != null;
  }
}
```

Available helpers: `injectClerk()`, `injectAuth()`, `injectUser()`, `injectSession()`, `injectOrganization()`.

### Route Guard

Protect routes with `clerkAuthGuard`:

```typescript
import { Routes } from '@angular/router';
import { clerkAuthGuard } from 'clerk-angular';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard.component').then(m => m.DashboardComponent),
    canActivate: [clerkAuthGuard({ signInUrl: '/sign-in' })],
  },
];
```

### HTTP Interceptor

Automatically attach Clerk session tokens to outgoing requests:

```typescript
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { clerkTokenInterceptor } from 'clerk-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([clerkTokenInterceptor])),
    provideClerk({ publishableKey: 'pk_test_...' }),
  ],
};
```

### Themes

Customize Clerk component appearance:

```typescript
import { provideClerk, createClerkTheme, clerkDarkTheme } from 'clerk-angular';

provideClerk({
  publishableKey: 'pk_test_...',
  appearance: createClerkTheme({ primaryColor: '#6366f1' }),
  // or use a preset:
  // appearance: clerkDarkTheme,
});
```

## Demo

See [`projects/demo/`](projects/demo/) for a working example app with routing, auth guards, and all components.

## API Reference

| Export | Type | Description |
|---|---|---|
| `provideClerk(options)` | Provider | Configures Clerk for dependency injection |
| `ClerkService` | Service | Core service with auth state signals |
| `injectClerk()` | Signal | Clerk instance |
| `injectAuth()` | Signal | Auth state (userId, sessionId, etc.) |
| `injectUser()` | Signal | Current user object |
| `injectSession()` | Signal | Current session object |
| `injectOrganization()` | Signal | Current organization object |
| `clerkAuthGuard(options)` | Guard | Route guard for protected routes |
| `clerkTokenInterceptor` | Interceptor | Attaches session tokens to HTTP requests |
| `createClerkTheme(options)` | Function | Creates custom theme appearance |
| `clerkDarkTheme` | Theme | Dark theme preset |
| `clerkMinimalTheme` | Theme | Minimal theme preset |

## License

MIT
