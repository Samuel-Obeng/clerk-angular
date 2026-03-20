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
      publishableKey: 'pk_test_Y2hvaWNlLWRvZS0yNC5jbGVyay5hY2NvdW50cy5kZXYk',
      appearance: createClerkTheme({ primaryColor: '#6366f1' }),
    }),
  ],
};
