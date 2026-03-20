# Clerk Angular SDK — Getting Started Guide

This guide walks you through adding user sign-in and sign-up to your Angular app using the `clerk-angular` SDK. It covers everything from installation to protecting pages, step by step.

---

## Table of Contents

1. [What Is This SDK?](#1-what-is-this-sdk)
2. [Before You Begin](#2-before-you-begin)
3. [Install the Package](#3-install-the-package)
4. [Set Up Clerk in Your App](#4-set-up-clerk-in-your-app)
5. [Show a Sign-In and Sign-Up Page](#5-show-a-sign-in-and-sign-up-page)
6. [Show Different Things for Signed-In and Signed-Out Users](#6-show-different-things-for-signed-in-and-signed-out-users)
7. [Show a Loading Spinner While Clerk Loads](#7-show-a-loading-spinner-while-clerk-loads)
8. [Add Sign-In, Sign-Up, and Sign-Out Buttons](#8-add-sign-in-sign-up-and-sign-out-buttons)
9. [Show the User Button (Avatar Menu)](#9-show-the-user-button-avatar-menu)
10. [Read User Info in a Component](#10-read-user-info-in-a-component)
11. [Protect a Page So Only Signed-In Users Can See It](#11-protect-a-page-so-only-signed-in-users-can-see-it)
12. [Send the User's Token with HTTP Requests](#12-send-the-users-token-with-http-requests)
13. [Change How Clerk Components Look (Themes)](#13-change-how-clerk-components-look-themes)
14. [Use Organization Features](#14-use-organization-features)
15. [All Available Pieces](#15-all-available-pieces)
16. [Full Example: Putting It All Together](#16-full-example-putting-it-all-together)
17. [Common Questions](#17-common-questions)

---

## 1. What Is This SDK?

Clerk is a service that handles user accounts for your app — sign in, sign up, passwords, sessions, and more. This SDK lets you use Clerk inside an Angular app.

It gives you:

- **Components** — ready-made sign-in forms, user menus, and buttons you can drop into your templates.
- **Signals** — small helper functions that give you the current user, session, and auth info as Angular signals.
- **A route guard** — a way to block pages so only signed-in users can see them.
- **An HTTP interceptor** — a tool that automatically adds the user's session token to your API calls.
- **Themes** — a way to change the colors and fonts of Clerk's components to match your app.

---

## 2. Before You Begin

You will need:

- **An Angular app** (version 17 or newer). If you don't have one yet, create one with `ng new my-app`.
- **A Clerk account**. Go to [clerk.com](https://clerk.com) and sign up for free.
- **A publishable key**. After you create a Clerk project, you'll find your publishable key on the Clerk dashboard. It starts with `pk_test_` or `pk_live_`.

---

## 3. Install the Package

Open your terminal, go to your project folder, and run:

```bash
npm install clerk-angular @clerk/shared @clerk/types
```

This installs three packages:
- `clerk-angular` — the Angular SDK (this library).
- `@clerk/shared` — shared code that Clerk needs behind the scenes.
- `@clerk/types` — TypeScript types for Clerk objects.

---

## 4. Set Up Clerk in Your App

You need to tell your Angular app about Clerk **one time**, in your app config file. This is where you put your publishable key.

Open (or create) `src/app/app.config.ts` and add `provideClerk()`:

```typescript
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClerk } from 'clerk-angular';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClerk({
      publishableKey: 'pk_test_YOUR_KEY_HERE',  // <-- Replace with your key
    }),
  ],
};
```

That's it. Clerk will now load when your app starts.

---

## 5. Show a Sign-In and Sign-Up Page

Clerk comes with complete sign-in and sign-up forms. You just place them in a component.

### Sign-in page

Create a file called `sign-in-page.component.ts`:

```typescript
import { Component } from '@angular/core';
import { SignInComponent } from 'clerk-angular';

@Component({
  selector: 'app-sign-in-page',
  standalone: true,
  imports: [SignInComponent],
  template: `
    <div style="display: flex; justify-content: center; padding: 2rem;">
      <clerk-sign-in />
    </div>
  `,
})
export class SignInPageComponent {}
```

### Sign-up page

Create a file called `sign-up-page.component.ts`:

```typescript
import { Component } from '@angular/core';
import { SignUpComponent } from 'clerk-angular';

@Component({
  selector: 'app-sign-up-page',
  standalone: true,
  imports: [SignUpComponent],
  template: `
    <div style="display: flex; justify-content: center; padding: 2rem;">
      <clerk-sign-up />
    </div>
  `,
})
export class SignUpPageComponent {}
```

### Add routes for them

In your `app.routes.ts`, add paths for both pages:

```typescript
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'sign-in',
    loadComponent: () =>
      import('./sign-in-page.component').then(m => m.SignInPageComponent),
  },
  {
    path: 'sign-up',
    loadComponent: () =>
      import('./sign-up-page.component').then(m => m.SignUpPageComponent),
  },
];
```

Now if you go to `/sign-in` in your browser, you'll see a full sign-in form.

---

## 6. Show Different Things for Signed-In and Signed-Out Users

Use `<clerk-signed-in>` and `<clerk-signed-out>` to show or hide content based on whether the user is logged in.

```typescript
import { Component } from '@angular/core';
import { SignedInComponent, SignedOutComponent } from 'clerk-angular';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SignedInComponent, SignedOutComponent],
  template: `
    <clerk-signed-out>
      <p>You are not signed in. Please sign in to continue.</p>
    </clerk-signed-out>

    <clerk-signed-in>
      <p>Welcome back! You are signed in.</p>
    </clerk-signed-in>
  `,
})
export class HomeComponent {}
```

**How it works:** The content inside `<clerk-signed-in>` only shows up when the user is logged in. The content inside `<clerk-signed-out>` only shows up when the user is NOT logged in. You can use them anywhere in your app.

---

## 7. Show a Loading Spinner While Clerk Loads

When your app first starts, Clerk needs a moment to figure out if the user is signed in. During that time, you can show a loading message.

```typescript
import { Component } from '@angular/core';
import {
  ClerkLoadedComponent,
  ClerkLoadingComponent,
  SignedInComponent,
  SignedOutComponent,
} from 'clerk-angular';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    ClerkLoadedComponent,
    ClerkLoadingComponent,
    SignedInComponent,
    SignedOutComponent,
  ],
  template: `
    <clerk-loading>
      <span>Loading...</span>
    </clerk-loading>

    <clerk-loaded>
      <clerk-signed-in>
        <p>You're in!</p>
      </clerk-signed-in>
      <clerk-signed-out>
        <p>Please sign in.</p>
      </clerk-signed-out>
    </clerk-loaded>
  `,
})
export class HeaderComponent {}
```

- `<clerk-loading>` — shows its content **only while** Clerk is still loading.
- `<clerk-loaded>` — shows its content **only after** Clerk is done loading.

---

## 8. Add Sign-In, Sign-Up, and Sign-Out Buttons

Instead of sending users to a separate page, you can open a sign-in or sign-up popup with a button.

```typescript
import { Component } from '@angular/core';
import {
  SignInButtonComponent,
  SignUpButtonComponent,
  SignOutButtonComponent,
} from 'clerk-angular';

@Component({
  selector: 'app-auth-buttons',
  standalone: true,
  imports: [SignInButtonComponent, SignUpButtonComponent, SignOutButtonComponent],
  template: `
    <!-- Opens a sign-in popup when clicked -->
    <clerk-sign-in-button mode="modal">
      <button>Sign in</button>
    </clerk-sign-in-button>

    <!-- Opens a sign-up popup when clicked -->
    <clerk-sign-up-button mode="modal">
      <button>Sign up</button>
    </clerk-sign-up-button>

    <!-- Signs the user out when clicked -->
    <clerk-sign-out-button>
      <button>Sign out</button>
    </clerk-sign-out-button>
  `,
})
export class AuthButtonsComponent {}
```

**The `mode` input:**
- `mode="modal"` — opens a popup on the same page.
- If you leave `mode` out, the button redirects the user to a sign-in/sign-up page instead.

**The sign-out button** also accepts optional inputs:
- `redirectUrl` — where to send the user after they sign out.
- `sessionId` — if the user has multiple sessions, which one to sign out of.

---

## 9. Show the User Button (Avatar Menu)

The user button is a small avatar that, when clicked, opens a dropdown menu where the user can manage their account or sign out.

```typescript
import { Component } from '@angular/core';
import { UserButtonComponent } from 'clerk-angular';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [UserButtonComponent],
  template: `
    <clerk-user-button />
  `,
})
export class NavbarComponent {}
```

You can also show a full user profile page instead of a dropdown:

```typescript
import { Component } from '@angular/core';
import { UserProfileComponent } from 'clerk-angular';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [UserProfileComponent],
  template: `<clerk-user-profile />`,
})
export class ProfilePageComponent {}
```

---

## 10. Read User Info in a Component

Sometimes you need to use the user's name, email, or ID in your code. Use the **inject helpers** for this. They return Angular signals, which means your template updates automatically when the data changes.

```typescript
import { Component } from '@angular/core';
import { injectUser, injectAuth } from 'clerk-angular';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    @if (user(); as u) {
      <h1>Hello, {{ u.firstName }}!</h1>
      <p>Your email: {{ u.emailAddresses?.[0]?.emailAddress }}</p>
      <p>Your user ID: {{ auth().userId }}</p>
    }
  `,
})
export class DashboardComponent {
  user = injectUser();       // Signal with the user object (or null)
  auth = injectAuth();       // Signal with auth info like userId, sessionId
}
```

### All inject helpers

There are five inject helpers. Each one returns a signal you can read in your template or code:

| Helper | What it gives you |
|---|---|
| `injectUser()` | The current user (name, email, avatar, etc.) or `null` |
| `injectAuth()` | Auth info: `userId`, `sessionId`, `orgId`, `orgRole`, etc. |
| `injectSession()` | The current session object or `null` |
| `injectOrganization()` | The current organization or `null` |
| `injectClerk()` | The Clerk instance itself (for advanced use) |

**Important:** These helpers must be called at the top level of your component class (not inside a method). This is because Angular's `inject()` only works during construction.

```typescript
// CORRECT — at the class level
export class MyComponent {
  user = injectUser();
}

// WRONG — inside a method
export class MyComponent {
  doSomething() {
    const user = injectUser(); // This will throw an error!
  }
}
```

---

## 11. Protect a Page So Only Signed-In Users Can See It

Use `clerkAuthGuard` in your route config. If someone who is not signed in tries to visit the page, they get sent to the sign-in page instead.

```typescript
import { Routes } from '@angular/router';
import { clerkAuthGuard } from 'clerk-angular';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard.component').then(m => m.DashboardComponent),
    canActivate: [clerkAuthGuard({ signInUrl: '/sign-in' })],
  },
];
```

### Options

| Option | What it does |
|---|---|
| `signInUrl` | Where to send users who are not signed in. Defaults to `'/sign-in'`. |
| `orgRole` | Only allow users with this organization role (e.g. `'admin'`). |
| `orgPermission` | Only allow users with this permission (e.g. `'org:billing:manage'`). |

### Checking for a role

```typescript
canActivate: [clerkAuthGuard({
  signInUrl: '/sign-in',
  orgRole: 'admin',       // only admins can access this page
})],
```

### Checking for a permission

```typescript
canActivate: [clerkAuthGuard({
  signInUrl: '/sign-in',
  orgPermission: 'org:reports:view',  // only users with this permission
})],
```

---

## 12. Send the User's Token with HTTP Requests

When your Angular app talks to your backend API, your backend needs to know who the user is. The `clerkTokenInterceptor` automatically adds the user's session token to every HTTP request as a `Bearer` token in the `Authorization` header.

### Set it up

Add `clerkTokenInterceptor` to your app config, alongside `provideHttpClient`:

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideClerk, clerkTokenInterceptor } from 'clerk-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([clerkTokenInterceptor])),
    provideClerk({
      publishableKey: 'pk_test_YOUR_KEY_HERE',
    }),
  ],
};
```

### What happens behind the scenes

1. When you use Angular's `HttpClient` to make a request, the interceptor runs first.
2. If the user is signed in, it gets a session token from Clerk.
3. It adds the token to the request as `Authorization: Bearer <token>`.
4. If the user is NOT signed in, the request goes through without a token.

### Use HttpClient like normal

You don't need to do anything special in your components or services. Just use `HttpClient` the way you always do:

```typescript
import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({ ... })
export class DashboardComponent {
  private http = inject(HttpClient);

  loadData() {
    // The token is added automatically — you don't have to think about it!
    this.http.get('/api/my-data').subscribe(data => {
      console.log(data);
    });
  }
}
```

### Get a token yourself (advanced)

If you need the token for something other than HTTP calls, you can get it directly from `ClerkService`:

```typescript
import { Component, inject } from '@angular/core';
import { ClerkService } from 'clerk-angular';

@Component({ ... })
export class MyComponent {
  private clerkService = inject(ClerkService);

  async getMyToken() {
    const token = await this.clerkService.getToken();
    console.log(token); // The JWT string, or null if not signed in
  }
}
```

---

## 13. Change How Clerk Components Look (Themes)

By default, Clerk components have their own look. You can change the colors, fonts, and border radius to match your app.

### Option A: Use `createClerkTheme()` for custom colors

```typescript
import { provideClerk, createClerkTheme } from 'clerk-angular';

provideClerk({
  publishableKey: 'pk_test_YOUR_KEY_HERE',
  appearance: createClerkTheme({
    primaryColor: '#6366f1',       // Your brand color
    backgroundColor: '#ffffff',    // Card background
    textColor: '#111827',          // Text color
    borderRadius: '0.5rem',        // Corner rounding
    fontFamily: 'Inter, sans-serif',
  }),
});
```

### Option B: Use a preset theme

There are two built-in themes you can use right away:

```typescript
import { provideClerk, clerkDarkTheme } from 'clerk-angular';

provideClerk({
  publishableKey: 'pk_test_YOUR_KEY_HERE',
  appearance: clerkDarkTheme,
});
```

| Preset | What it looks like |
|---|---|
| `clerkDarkTheme` | Dark background with indigo accents |
| `clerkMinimalTheme` | Light, clean look with no shadows |

### Option C: Extend a preset with your own colors

```typescript
import { provideClerk, createClerkTheme, clerkDarkTheme } from 'clerk-angular';

provideClerk({
  publishableKey: 'pk_test_YOUR_KEY_HERE',
  appearance: createClerkTheme({
    base: clerkDarkTheme,          // Start from the dark theme
    primaryColor: '#8b5cf6',       // Override just the primary color
  }),
});
```

### Option D: Auto-detect from CSS variables

If you set CSS custom properties on your page, `createClerkTheme()` picks them up automatically with no arguments:

```css
/* In your global styles.css */
:root {
  --clerk-primary: #6366f1;
  --clerk-background: #ffffff;
  --clerk-text: #111827;
  --clerk-radius: 0.5rem;
  --clerk-font: 'Inter', sans-serif;
}
```

```typescript
provideClerk({
  publishableKey: 'pk_test_YOUR_KEY_HERE',
  appearance: createClerkTheme(),  // No arguments — reads from CSS variables
});
```

---

## 14. Use Organization Features

If your Clerk project uses organizations, there are components for managing them.

### Organization switcher

A dropdown that lets the user switch between their organizations:

```html
<clerk-organization-switcher />
```

### Organization profile

A full management page for the current organization:

```html
<clerk-organization-profile />
```

### Organization list

A list of all organizations the user belongs to:

```html
<clerk-organization-list />
```

### Create organization

A form for creating a new organization:

```html
<clerk-create-organization />
```

### Read organization info in code

```typescript
import { injectOrganization } from 'clerk-angular';

export class MyComponent {
  org = injectOrganization();

  get orgName() {
    return this.org()?.name;
  }
}
```

---

## 15. All Available Pieces

Here is everything the SDK gives you:

### Provider

| Name | What it does |
|---|---|
| `provideClerk(options)` | Sets up Clerk for your whole app. Call it once in `app.config.ts`. |

### Service

| Name | What it does |
|---|---|
| `ClerkService` | The main service. Has methods like `getToken()`, `signOut()`, `openSignIn()`, and signal properties like `user`, `auth`, `session`. |

### Inject Helpers

| Name | Returns |
|---|---|
| `injectClerk()` | Signal of the Clerk instance |
| `injectAuth()` | Signal of auth state (userId, sessionId, orgId, etc.) |
| `injectUser()` | Signal of the current user object |
| `injectSession()` | Signal of the current session object |
| `injectOrganization()` | Signal of the current organization |

### UI Components (mount Clerk's prebuilt UI)

| Selector | Component Class | What it shows |
|---|---|---|
| `<clerk-sign-in />` | `SignInComponent` | Sign-in form |
| `<clerk-sign-up />` | `SignUpComponent` | Sign-up form |
| `<clerk-user-button />` | `UserButtonComponent` | User avatar with dropdown menu |
| `<clerk-user-profile />` | `UserProfileComponent` | User profile management page |
| `<clerk-organization-switcher />` | `OrganizationSwitcherComponent` | Organization switcher dropdown |
| `<clerk-organization-profile />` | `OrganizationProfileComponent` | Organization management page |
| `<clerk-organization-list />` | `OrganizationListComponent` | List of user's organizations |
| `<clerk-create-organization />` | `CreateOrganizationComponent` | Create organization form |
| `<clerk-google-one-tap />` | `GoogleOneTapComponent` | Google One Tap sign-in prompt |
| `<clerk-waitlist />` | `WaitlistComponent` | Waitlist sign-up form |
| `<clerk-pricing-table />` | `PricingTableComponent` | Pricing table |

### Control Components (show/hide content)

| Selector | Component Class | When its content shows |
|---|---|---|
| `<clerk-loading>` | `ClerkLoadingComponent` | While Clerk is loading |
| `<clerk-loaded>` | `ClerkLoadedComponent` | After Clerk has loaded |
| `<clerk-signed-in>` | `SignedInComponent` | When the user is signed in |
| `<clerk-signed-out>` | `SignedOutComponent` | When the user is signed out |

### Button Components

| Selector | Component Class | What it does |
|---|---|---|
| `<clerk-sign-in-button>` | `SignInButtonComponent` | Opens sign-in (modal or redirect) |
| `<clerk-sign-up-button>` | `SignUpButtonComponent` | Opens sign-up (modal or redirect) |
| `<clerk-sign-out-button>` | `SignOutButtonComponent` | Signs the user out |

### Guard

| Name | What it does |
|---|---|
| `clerkAuthGuard(options?)` | Blocks a route if the user is not signed in (or lacks a role/permission) |

### Interceptor

| Name | What it does |
|---|---|
| `clerkTokenInterceptor` | Adds the user's session token to HTTP requests automatically |

### Themes

| Name | What it does |
|---|---|
| `createClerkTheme(options?)` | Builds a custom theme from your colors, or reads from CSS variables |
| `clerkDarkTheme` | A dark theme preset |
| `clerkMinimalTheme` | A minimal, clean theme preset |

---

## 16. Full Example: Putting It All Together

Here's a complete small app that uses most of the SDK features.

### `app.config.ts`

```typescript
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideClerk, clerkTokenInterceptor, createClerkTheme } from 'clerk-angular';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([clerkTokenInterceptor])),
    provideClerk({
      publishableKey: 'pk_test_YOUR_KEY_HERE',
      appearance: createClerkTheme({ primaryColor: '#6366f1' }),
    }),
  ],
};
```

### `app.routes.ts`

```typescript
import { Routes } from '@angular/router';
import { clerkAuthGuard } from 'clerk-angular';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home.component').then(m => m.HomeComponent),
  },
  {
    path: 'sign-in',
    loadComponent: () => import('./sign-in-page.component').then(m => m.SignInPageComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard.component').then(m => m.DashboardComponent),
    canActivate: [clerkAuthGuard({ signInUrl: '/sign-in' })],
  },
];
```

### `app.component.ts`

```typescript
import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import {
  ClerkLoadedComponent,
  ClerkLoadingComponent,
  SignedInComponent,
  SignedOutComponent,
  UserButtonComponent,
  SignInButtonComponent,
} from 'clerk-angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    ClerkLoadedComponent,
    ClerkLoadingComponent,
    SignedInComponent,
    SignedOutComponent,
    UserButtonComponent,
    SignInButtonComponent,
  ],
  template: `
    <nav>
      <a routerLink="/">Home</a>
      <a routerLink="/dashboard">Dashboard</a>

      <clerk-loading>
        <span>Loading...</span>
      </clerk-loading>

      <clerk-loaded>
        <clerk-signed-in>
          <clerk-user-button />
        </clerk-signed-in>

        <clerk-signed-out>
          <clerk-sign-in-button mode="modal">
            <button>Sign in</button>
          </clerk-sign-in-button>
        </clerk-signed-out>
      </clerk-loaded>
    </nav>

    <router-outlet />
  `,
})
export class AppComponent {}
```

### `dashboard.component.ts`

```typescript
import { Component } from '@angular/core';
import { injectUser, injectAuth } from 'clerk-angular';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <h1>Dashboard</h1>
    @if (user(); as u) {
      <p>Hello, {{ u.firstName }}!</p>
      <p>User ID: {{ auth().userId }}</p>
    }
  `,
})
export class DashboardComponent {
  user = injectUser();
  auth = injectAuth();
}
```

---

## 17. Common Questions

### Where do I get my publishable key?

Go to the [Clerk Dashboard](https://dashboard.clerk.com), select your project, and look under **API Keys**. Copy the key that starts with `pk_test_` (for development) or `pk_live_` (for production).

### Can I use this with Angular 17, 18, 19, or 20?

Yes. The SDK works with Angular 17 through 20.

### Do I need to import every component I use?

Yes. Since all components are standalone, you add them to the `imports` array of whichever component uses them.

### What happens on the server (SSR)?

The SDK checks if it is running in a browser before loading Clerk. On the server, Clerk does not load and the signals return their default values (`null` for user/session/organization, empty auth state). The control components (`<clerk-loading>`, `<clerk-signed-out>`, etc.) work safely on the server.

### How do I sign out a user from code?

Inject `ClerkService` and call `signOut()`:

```typescript
import { inject } from '@angular/core';
import { ClerkService } from 'clerk-angular';

export class MyComponent {
  private clerk = inject(ClerkService);

  logout() {
    this.clerk.signOut({ redirectUrl: '/' });
  }
}
```

### How do I open the sign-in popup from code?

```typescript
this.clerk.openSignIn();
```

You can also use `openSignUp()`, `openUserProfile()`, `openOrganizationProfile()`, and `openCreateOrganization()`.

### Can I use the guard to check for an organization role?

Yes. Pass `orgRole` or `orgPermission`:

```typescript
canActivate: [clerkAuthGuard({ orgRole: 'admin' })]
```

### Where can I learn more?

- [Clerk Documentation](https://clerk.com/docs)
- [Demo app in this repo](projects/demo/) — a working example with routing, guards, and all components
