import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { signal, computed } from '@angular/core';
import { ClerkService } from '../clerk.service';
import { CLERK_OPTIONS } from '../clerk.tokens';
import { clerkTokenInterceptor } from './clerk-token.interceptor';
import { createMockSession } from '../../__mocks__/clerk-test-utils';

function createMockClerkService(sessionValue: any = null) {
  const _session = signal(sessionValue);
  return {
    session: _session.asReadonly(),
    getToken: jest.fn().mockResolvedValue(sessionValue ? 'mock-bearer-token' : null),
    _setSession: (val: any) => _session.set(val),
  };
}

describe('clerkTokenInterceptor', () => {
  let httpClient: HttpClient;
  let httpTesting: HttpTestingController;
  let mockClerkService: ReturnType<typeof createMockClerkService>;

  function configure(sessionValue: any = null) {
    mockClerkService = createMockClerkService(sessionValue);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([clerkTokenInterceptor])),
        provideHttpClientTesting(),
        { provide: ClerkService, useValue: mockClerkService },
        { provide: CLERK_OPTIONS, useValue: { publishableKey: 'pk_test' } },
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
  }

  beforeEach(() => {
    TestBed.resetTestingModule();
  });

  afterEach(() => {
    httpTesting?.verify();
  });

  it('should pass request through when no session', () => {
    configure(null);
    httpClient.get('/api/data').subscribe();

    const req = httpTesting.expectOne('/api/data');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('should attach Authorization header when session and token exist', async () => {
    const mockSession = createMockSession();
    configure(mockSession);

    httpClient.get('/api/data').subscribe();

    // Wait for the async getToken to resolve
    await new Promise(resolve => setTimeout(resolve, 0));

    const req = httpTesting.expectOne('/api/data');
    expect(req.request.headers.get('Authorization')).toBe('Bearer mock-bearer-token');
    req.flush({});
  });

  it('should pass through when getToken returns null', async () => {
    const mockSession = createMockSession();
    configure(mockSession);
    mockClerkService.getToken.mockResolvedValue(null);

    httpClient.get('/api/data').subscribe();

    await new Promise(resolve => setTimeout(resolve, 0));

    const req = httpTesting.expectOne('/api/data');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });
});
