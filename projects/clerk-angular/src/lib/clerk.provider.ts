import {
  APP_INITIALIZER,
  EnvironmentProviders,
  makeEnvironmentProviders,
} from '@angular/core';
import { ClerkService } from './clerk.service';
import { CLERK_OPTIONS, type ClerkProviderOptions } from './clerk.tokens';

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
