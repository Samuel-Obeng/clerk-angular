import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { ClerkService } from '../../clerk.service';
import { CLERK_OPTIONS } from '../../clerk.tokens';
import { SignInComponent } from './sign-in.component';
import { SignUpComponent } from './sign-up.component';
import { UserButtonComponent } from './user-button.component';
import { UserProfileComponent } from './user-profile.component';
import { OrganizationSwitcherComponent } from './organization-switcher.component';
import { OrganizationProfileComponent } from './organization-profile.component';
import { OrganizationListComponent } from './organization-list.component';
import { CreateOrganizationComponent } from './create-organization.component';
import { GoogleOneTapComponent } from './google-one-tap.component';
import { WaitlistComponent } from './waitlist.component';
import { PricingTableComponent } from './pricing-table.component';

function createMockClerkService() {
  return {
    loaded: signal(false).asReadonly(),
    clerk: signal(null).asReadonly(),
  };
}

function setup(componentType: any) {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({
    imports: [componentType],
    providers: [
      { provide: ClerkService, useValue: createMockClerkService() },
      { provide: CLERK_OPTIONS, useValue: { publishableKey: 'pk_test' } },
    ],
  });
  return TestBed.createComponent(componentType);
}

describe('SignInComponent', () => {
  it('should have mountName = mountSignIn', () => {
    const fixture = setup(SignInComponent);
    expect((fixture.componentInstance as any).mountName).toBe('mountSignIn');
  });

  it('should have unmountName = unmountSignIn', () => {
    const fixture = setup(SignInComponent);
    expect((fixture.componentInstance as any).unmountName).toBe('unmountSignIn');
  });

  it('should return all inputs in getProps', () => {
    const fixture = setup(SignInComponent);
    const comp = fixture.componentInstance;
    comp.appearance = { variables: {} };
    comp.routing = 'path';
    comp.path = '/sign-in';
    comp.redirectUrl = '/dashboard';
    comp.signUpUrl = '/sign-up';
    comp.forceRedirectUrl = '/force';
    comp.fallbackRedirectUrl = '/fallback';
    comp.signUpForceRedirectUrl = '/su-force';
    comp.signUpFallbackRedirectUrl = '/su-fallback';
    comp.transferable = true;
    comp.initialValues = { emailAddress: 'test@test.com' };

    const props = (comp as any).getProps();
    expect(props.appearance).toEqual({ variables: {} });
    expect(props.routing).toBe('path');
    expect(props.path).toBe('/sign-in');
    expect(props.redirectUrl).toBe('/dashboard');
    expect(props.signUpUrl).toBe('/sign-up');
    expect(props.forceRedirectUrl).toBe('/force');
    expect(props.fallbackRedirectUrl).toBe('/fallback');
    expect(props.signUpForceRedirectUrl).toBe('/su-force');
    expect(props.signUpFallbackRedirectUrl).toBe('/su-fallback');
    expect(props.transferable).toBe(true);
    expect(props.initialValues).toEqual({ emailAddress: 'test@test.com' });
  });
});

describe('SignUpComponent', () => {
  it('should have mountName = mountSignUp', () => {
    const fixture = setup(SignUpComponent);
    expect((fixture.componentInstance as any).mountName).toBe('mountSignUp');
  });

  it('should have unmountName = unmountSignUp', () => {
    const fixture = setup(SignUpComponent);
    expect((fixture.componentInstance as any).unmountName).toBe('unmountSignUp');
  });

  it('should return all inputs in getProps', () => {
    const fixture = setup(SignUpComponent);
    const comp = fixture.componentInstance;
    comp.appearance = {};
    comp.routing = 'hash';
    comp.path = '/sign-up';
    comp.redirectUrl = '/welcome';
    comp.signInUrl = '/sign-in';
    comp.forceRedirectUrl = '/force';
    comp.fallbackRedirectUrl = '/fallback';
    comp.signInForceRedirectUrl = '/si-force';
    comp.signInFallbackRedirectUrl = '/si-fallback';
    comp.unsafeMetadata = { role: 'user' };
    comp.initialValues = { firstName: 'John' };

    const props = (comp as any).getProps();
    expect(props.signInUrl).toBe('/sign-in');
    expect(props.unsafeMetadata).toEqual({ role: 'user' });
    expect(props.initialValues).toEqual({ firstName: 'John' });
  });
});

describe('UserButtonComponent', () => {
  it('should have mountName = mountUserButton', () => {
    const fixture = setup(UserButtonComponent);
    expect((fixture.componentInstance as any).mountName).toBe('mountUserButton');
  });

  it('should have unmountName = unmountUserButton', () => {
    const fixture = setup(UserButtonComponent);
    expect((fixture.componentInstance as any).unmountName).toBe('unmountUserButton');
  });

  it('should return all inputs in getProps', () => {
    const fixture = setup(UserButtonComponent);
    const comp = fixture.componentInstance;
    comp.appearance = {};
    comp.afterSignOutUrl = '/signed-out';
    comp.afterMultiSessionSingleSignOutUrl = '/multi-out';
    comp.afterSwitchSessionUrl = '/switch';
    comp.showName = true;
    comp.signInUrl = '/sign-in';
    comp.userProfileMode = 'modal';
    comp.userProfileUrl = '/profile';

    const props = (comp as any).getProps();
    expect(props.afterSignOutUrl).toBe('/signed-out');
    expect(props.afterMultiSessionSingleSignOutUrl).toBe('/multi-out');
    expect(props.showName).toBe(true);
    expect(props.userProfileMode).toBe('modal');
    expect(props.userProfileUrl).toBe('/profile');
  });
});

describe('UserProfileComponent', () => {
  it('should have mountName = mountUserProfile', () => {
    const fixture = setup(UserProfileComponent);
    expect((fixture.componentInstance as any).mountName).toBe('mountUserProfile');
  });

  it('should have unmountName = unmountUserProfile', () => {
    const fixture = setup(UserProfileComponent);
    expect((fixture.componentInstance as any).unmountName).toBe('unmountUserProfile');
  });

  it('should return all inputs in getProps', () => {
    const fixture = setup(UserProfileComponent);
    const comp = fixture.componentInstance;
    comp.appearance = {};
    comp.routing = 'path';
    comp.path = '/profile';

    const props = (comp as any).getProps();
    expect(props.routing).toBe('path');
    expect(props.path).toBe('/profile');
  });
});

describe('OrganizationSwitcherComponent', () => {
  it('should have mountName = mountOrganizationSwitcher', () => {
    const fixture = setup(OrganizationSwitcherComponent);
    expect((fixture.componentInstance as any).mountName).toBe('mountOrganizationSwitcher');
  });

  it('should have unmountName = unmountOrganizationSwitcher', () => {
    const fixture = setup(OrganizationSwitcherComponent);
    expect((fixture.componentInstance as any).unmountName).toBe('unmountOrganizationSwitcher');
  });

  it('should return all inputs in getProps', () => {
    const fixture = setup(OrganizationSwitcherComponent);
    const comp = fixture.componentInstance;
    comp.hidePersonal = true;
    comp.afterCreateOrganizationUrl = '/created';
    comp.afterLeaveOrganizationUrl = '/left';
    comp.afterSelectOrganizationUrl = '/selected';
    comp.afterSelectPersonalUrl = '/personal';
    comp.organizationProfileMode = 'navigation';
    comp.organizationProfileUrl = '/org-profile';
    comp.createOrganizationMode = 'modal';
    comp.createOrganizationUrl = '/create-org';

    const props = (comp as any).getProps();
    expect(props.hidePersonal).toBe(true);
    expect(props.afterCreateOrganizationUrl).toBe('/created');
    expect(props.afterLeaveOrganizationUrl).toBe('/left');
    expect(props.organizationProfileMode).toBe('navigation');
    expect(props.createOrganizationMode).toBe('modal');
  });
});

describe('OrganizationProfileComponent', () => {
  it('should have mountName = mountOrganizationProfile', () => {
    const fixture = setup(OrganizationProfileComponent);
    expect((fixture.componentInstance as any).mountName).toBe('mountOrganizationProfile');
  });

  it('should have unmountName = unmountOrganizationProfile', () => {
    const fixture = setup(OrganizationProfileComponent);
    expect((fixture.componentInstance as any).unmountName).toBe('unmountOrganizationProfile');
  });

  it('should return all inputs in getProps', () => {
    const fixture = setup(OrganizationProfileComponent);
    const comp = fixture.componentInstance;
    comp.routing = 'path';
    comp.path = '/org';
    comp.afterLeaveOrganizationUrl = '/left';

    const props = (comp as any).getProps();
    expect(props.routing).toBe('path');
    expect(props.path).toBe('/org');
    expect(props.afterLeaveOrganizationUrl).toBe('/left');
  });
});

describe('OrganizationListComponent', () => {
  it('should have mountName = mountOrganizationList', () => {
    const fixture = setup(OrganizationListComponent);
    expect((fixture.componentInstance as any).mountName).toBe('mountOrganizationList');
  });

  it('should have unmountName = unmountOrganizationList', () => {
    const fixture = setup(OrganizationListComponent);
    expect((fixture.componentInstance as any).unmountName).toBe('unmountOrganizationList');
  });

  it('should return all inputs in getProps', () => {
    const fixture = setup(OrganizationListComponent);
    const comp = fixture.componentInstance;
    comp.hidePersonal = false;
    comp.afterCreateOrganizationUrl = '/created';
    comp.afterSelectOrganizationUrl = '/selected';
    comp.afterSelectPersonalUrl = '/personal';

    const props = (comp as any).getProps();
    expect(props.hidePersonal).toBe(false);
    expect(props.afterCreateOrganizationUrl).toBe('/created');
    expect(props.afterSelectOrganizationUrl).toBe('/selected');
    expect(props.afterSelectPersonalUrl).toBe('/personal');
  });
});

describe('CreateOrganizationComponent', () => {
  it('should have mountName = mountCreateOrganization', () => {
    const fixture = setup(CreateOrganizationComponent);
    expect((fixture.componentInstance as any).mountName).toBe('mountCreateOrganization');
  });

  it('should have unmountName = unmountCreateOrganization', () => {
    const fixture = setup(CreateOrganizationComponent);
    expect((fixture.componentInstance as any).unmountName).toBe('unmountCreateOrganization');
  });

  it('should return all inputs in getProps', () => {
    const fixture = setup(CreateOrganizationComponent);
    const comp = fixture.componentInstance;
    comp.routing = 'path';
    comp.path = '/create-org';
    comp.afterCreateOrganizationUrl = '/done';
    comp.skipInvitationScreen = true;

    const props = (comp as any).getProps();
    expect(props.routing).toBe('path');
    expect(props.path).toBe('/create-org');
    expect(props.afterCreateOrganizationUrl).toBe('/done');
    expect(props.skipInvitationScreen).toBe(true);
  });
});

describe('GoogleOneTapComponent', () => {
  it('should have mountName = openGoogleOneTap', () => {
    const fixture = setup(GoogleOneTapComponent);
    expect((fixture.componentInstance as any).mountName).toBe('openGoogleOneTap');
  });

  it('should have unmountName = closeGoogleOneTap', () => {
    const fixture = setup(GoogleOneTapComponent);
    expect((fixture.componentInstance as any).unmountName).toBe('closeGoogleOneTap');
  });

  it('should return all inputs in getProps', () => {
    const fixture = setup(GoogleOneTapComponent);
    const comp = fixture.componentInstance;
    comp.cancelOnTapOutside = true;
    comp.itpSupport = false;
    comp.fedCmSupport = true;

    const props = (comp as any).getProps();
    expect(props.cancelOnTapOutside).toBe(true);
    expect(props.itpSupport).toBe(false);
    expect(props.fedCmSupport).toBe(true);
  });
});

describe('WaitlistComponent', () => {
  it('should have mountName = mountWaitlist', () => {
    const fixture = setup(WaitlistComponent);
    expect((fixture.componentInstance as any).mountName).toBe('mountWaitlist');
  });

  it('should have unmountName = unmountWaitlist', () => {
    const fixture = setup(WaitlistComponent);
    expect((fixture.componentInstance as any).unmountName).toBe('unmountWaitlist');
  });

  it('should return all inputs in getProps', () => {
    const fixture = setup(WaitlistComponent);
    const comp = fixture.componentInstance;
    comp.afterJoinWaitlistUrl = '/joined';
    comp.signInUrl = '/sign-in';

    const props = (comp as any).getProps();
    expect(props.afterJoinWaitlistUrl).toBe('/joined');
    expect(props.signInUrl).toBe('/sign-in');
  });
});

describe('PricingTableComponent', () => {
  it('should have mountName = mountPricingTable', () => {
    const fixture = setup(PricingTableComponent);
    expect((fixture.componentInstance as any).mountName).toBe('mountPricingTable');
  });

  it('should have unmountName = unmountPricingTable', () => {
    const fixture = setup(PricingTableComponent);
    expect((fixture.componentInstance as any).unmountName).toBe('unmountPricingTable');
  });

  it('should return appearance in getProps', () => {
    const fixture = setup(PricingTableComponent);
    const comp = fixture.componentInstance;
    comp.appearance = { variables: { colorPrimary: 'blue' } };

    const props = (comp as any).getProps();
    expect(props.appearance).toEqual({ variables: { colorPrimary: 'blue' } });
  });
});
