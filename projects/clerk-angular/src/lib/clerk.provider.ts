import {
  APP_INITIALIZER,
  EnvironmentProviders,
  makeEnvironmentProviders,
} from '@angular/core';
import { ClerkService } from './clerk.service';
import { CLERK_OPTIONS, type ClerkProviderOptions } from './clerk.tokens';

/**
 * Configures Clerk for an Angular application.
 *
 * Registers {@link ClerkService}, the {@link CLERK_OPTIONS} token, and an
 * `APP_INITIALIZER` that loads the Clerk JS scripts on startup.
 *
 * @example
 * ```typescript
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideClerk({ publishableKey: 'pk_live_...' }),
 *   ],
 * };
 * ```
 */
export function provideClerk(options: ClerkProviderOptions): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: CLERK_OPTIONS, useValue: options },
    ClerkService,
    {
      provide: APP_INITIALIZER,
      useFactory: (clerkService: ClerkService) => () => clerkService.init(),
      deps: [ClerkService],
      multi: true,
    },
  ]);
}
