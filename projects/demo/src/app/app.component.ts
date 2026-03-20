import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import {
  ClerkLoadedComponent,
  ClerkLoadingComponent,
  SignedInComponent,
  SignedOutComponent,
  UserButtonComponent,
  SignInButtonComponent,
  SignUpButtonComponent,
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
    SignUpButtonComponent,
  ],
  template: `
    <header>
      <nav>
        <a routerLink="/">Home</a>
        <a routerLink="/dashboard">Dashboard</a>

        <div class="spacer"></div>

        <clerk-loading>
          <span>Loading...</span>
        </clerk-loading>

        <clerk-loaded>
          <clerk-signed-in>
            <clerk-user-button />
          </clerk-signed-in>

          <clerk-signed-out>
            <clerk-sign-in-button mode="modal">
              <button class="btn">Sign in</button>
            </clerk-sign-in-button>
            <clerk-sign-up-button mode="modal">
              <button class="btn btn-outline">Sign up</button>
            </clerk-sign-up-button>
          </clerk-signed-out>
        </clerk-loaded>
      </nav>
    </header>

    <main>
      <router-outlet />
    </main>
  `,
  styles: [`
    header {
      border-bottom: 1px solid #e5e7eb;
      padding: 0.75rem 1.5rem;
    }
    nav {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    nav a {
      text-decoration: none;
      color: #374151;
      font-weight: 500;
    }
    nav a:hover {
      color: #6366f1;
    }
    .spacer {
      flex: 1;
    }
    .btn {
      padding: 0.5rem 1rem;
      border-radius: 0.375rem;
      border: none;
      background: #6366f1;
      color: white;
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 500;
    }
    .btn:hover {
      background: #4f46e5;
    }
    .btn-outline {
      background: transparent;
      border: 1px solid #d1d5db;
      color: #374151;
    }
    .btn-outline:hover {
      background: #f9fafb;
    }
    main {
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }
  `],
})
export class AppComponent {}
