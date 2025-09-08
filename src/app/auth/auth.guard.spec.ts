// src/app/auth/auth.guard.spec.ts (or .spec.ts you're running)
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, UrlTree } from '@angular/router';
import { Auth } from '@angular/fire/auth'; // <-- import the token

import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { AlreadyAuthedGuard } from './already-authed.guard';

class MockAuthService {
  private authed = false;
  isAuthed = () => this.authed;      // mirror your computed signal read: service.isAuthed()
  setAuthed(v: boolean) { this.authed = v; }
}

describe('Route Guards (Angular 20)', () => {
  let authSvc: MockAuthService;
  let router: Router;

  // helper to run functional guards inside DI
  const run = <T>(fn: (...a: any[]) => T, ...args: any[]) =>
    TestBed.runInInjectionContext(() => fn(...args));

  beforeEach(() => {
    authSvc = new MockAuthService();

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authSvc }, // stub your app AuthService
        { provide: Auth, useValue: {} },             // <-- stub Firebase Auth token
      ],
    });

    router = TestBed.inject(Router);
  });

  it('AuthGuard allows when authed', () => {
    authSvc.setAuthed(true);
    const res = run(AuthGuard, {} as any, {} as any);
    expect(res).toBe(true);
  });

  it('AuthGuard redirects to /login when not authed', () => {
    authSvc.setAuthed(false);
    const res = run(AuthGuard, {} as any, {} as any);
    expect(res instanceof UrlTree).toBe(true);
    expect(router.serializeUrl(res as UrlTree)).toBe('/login');
  });

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
