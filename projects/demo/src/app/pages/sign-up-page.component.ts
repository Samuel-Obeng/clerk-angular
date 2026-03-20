import { Component } from '@angular/core';
import { SignUpComponent } from 'clerk-angular';

@Component({
  selector: 'app-sign-up-page',
  standalone: true,
  imports: [SignUpComponent],
  template: `
    <div class="centered">
      <clerk-sign-up />
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
export class SignUpPageComponent {}
