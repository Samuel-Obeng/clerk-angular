import { Component } from '@angular/core';
import { injectAuth, injectUser } from 'clerk-angular';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <h1>Dashboard (Protected)</h1>

    @if (user(); as u) {
      <div class="card">
        <h2>User Info</h2>
        <p><strong>Name:</strong> {{ u.firstName }} {{ u.lastName }}</p>
        <p><strong>Email:</strong> {{ u.emailAddresses?.[0]?.emailAddress }}</p>
        <p><strong>User ID:</strong> {{ auth().userId }}</p>
        <p><strong>Session ID:</strong> {{ auth().sessionId }}</p>
      </div>
    }
  `,
  styles: [`
    .card {
      margin-top: 1.5rem;
      padding: 1.5rem;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
    }
    p { margin: 0.5rem 0; }
  `],
})
export class DashboardComponent {
  user = injectUser();
  auth = injectAuth();
}
