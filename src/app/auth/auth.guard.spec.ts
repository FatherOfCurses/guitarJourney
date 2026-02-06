import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, UrlSegment, UrlTree } from '@angular/router';
import { firstValueFrom, of } from 'rxjs';

// AuthGuard uses authState() from @angular/fire/auth, so we need to mock it
jest.mock('@angular/fire/auth', () => {
  const actual = jest.requireActual('@angular/fire/auth');
  return {
    ...actual,
    authState: jest.fn(),
  };
});

import { Auth, authState } from '@angular/fire/auth';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { AlreadyAuthedGuard } from './already-authed.guard';

class MockAuthService {
  private authed = false;
  isAuthed = () => this.authed;
  setAuthed(v: boolean) { this.authed = v; }
}

describe('Route Guards (Angular 20)', () => {
  let authSvc: MockAuthService;
  let router: Router;

  // helper: run functional guard inside DI context
  const run = <T>(fn: (...a: any[]) => T, ...args: any[]) =>
    TestBed.runInInjectionContext(() => fn(...args));

  beforeEach(() => {
    authSvc = new MockAuthService();

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authSvc },
        { provide: Auth, useValue: {} },
      ],
    });

    router = TestBed.inject(Router);
  });

  // ─── AuthGuard (CanMatchFn, Observable-based via authState) ─────
  it('AuthGuard allows when authed', async () => {
    (authState as jest.Mock).mockReturnValue(of({ uid: 'u1' }));
    const segments = [new UrlSegment('app', {})];
    const result$ = run(AuthGuard, {} as any, segments);
    const result = await firstValueFrom(result$ as any);
    expect(result).toBe(true);
  });

  it('AuthGuard redirects to /login when not authed', async () => {
    (authState as jest.Mock).mockReturnValue(of(null));
    const segments = [new UrlSegment('app', {})];
    const result$ = run(AuthGuard, {} as any, segments);
    const result = await firstValueFrom(result$ as any);
    expect(result instanceof UrlTree).toBe(true);
    expect(router.serializeUrl(result as UrlTree)).toBe('/login?redirect=%2Fapp');
  });

  // ─── AlreadyAuthedGuard (CanActivateFn, synchronous via AuthService) ─────
  it('AlreadyAuthedGuard allows when not authed', () => {
    authSvc.setAuthed(false);
    const res = run(AlreadyAuthedGuard, {} as any, {} as any);
    expect(res).toBe(true);
  });

  it('AlreadyAuthedGuard redirects authed users to /app', () => {
    authSvc.setAuthed(true);
    const res = run(AlreadyAuthedGuard, {} as any, {} as any);
    expect(res instanceof UrlTree).toBe(true);
    expect(router.serializeUrl(res as UrlTree)).toBe('/app');
  });
});
