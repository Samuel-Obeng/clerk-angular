import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  SignedInComponent,
  SignedOutComponent,
} from 'clerk-angular';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, SignedInComponent, SignedOutComponent],
  template: `
    <h1>Clerk Angular SDK Demo</h1>
    <p>This demo showcases the Clerk Angular SDK components.</p>

    <clerk-signed-out>
      <div class="card">
        <h2>Get started</h2>
        <p>Sign in or create an account to access the dashboard.</p>
        <a routerLink="/sign-in" class="link">Go to Sign In</a>
      </div>
    </clerk-signed-out>

    <clerk-signed-in>
      <div class="card">
        <h2>Welcome back!</h2>
        <p>You're signed in. Visit the dashboard to see protected content.</p>
        <a routerLink="/dashboard" class="link">Go to Dashboard</a>
      </div>
    </clerk-signed-in>
  `,
  styles: [`
    h1 { margin-bottom: 0.5rem; }
    .card {
      margin-top: 1.5rem;
      padding: 1.5rem;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
    }
    .link {
      color: #6366f1;
      font-weight: 500;
    }
  `],
})
export class HomeComponent {}
