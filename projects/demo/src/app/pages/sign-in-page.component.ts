import { Component } from '@angular/core';
import { SignInComponent } from 'clerk-angular';

@Component({
  selector: 'app-sign-in-page',
  standalone: true,
  imports: [SignInComponent],
  template: `
    <div class="centered">
      <clerk-sign-in />
    </div>
  `,
  styles: [`
    .centered {
      display: flex;
      justify-content: center;
      padding: 2rem 0;
    }
  `],
})
export class SignInPageComponent {}
