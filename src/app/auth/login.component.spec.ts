import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { LoginComponent } from './login.component';
import { AuthService } from './auth.service';

describe('LoginComponent', () => {
  let fixture: any;
  let cmp: LoginComponent;

  const authMock = {
    signInWithEmail: jest.fn(),
    signInWithGoogle: jest.fn(),
  };

  const routerMock = {
    navigateByUrl: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    TestBed.configureTestingModule({
      imports: [LoginComponent], // standalone component
      providers: [
        { provide: AuthService, useValue: authMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    // Avoid loading external templateUrl in tests
    TestBed.overrideComponent(LoginComponent, { set: { template: '' } });

    fixture = TestBed.createComponent(LoginComponent);
    cmp = fixture.componentInstance;
  });

  it('creates', () => {
    expect(cmp).toBeTruthy();
    expect(cmp.email).toBe('');
    expect(cmp.password).toBe('');
  });

  it('submit() signs in with email/password and navigates to /app', async () => {
    authMock.signInWithEmail.mockResolvedValueOnce({ user: { uid: 'u1' } });
    routerMock.navigateByUrl.mockResolvedValueOnce(true);

    cmp.email = 'user@example.com';
    cmp.password = 'pw123';

    await cmp.submit();

    expect(authMock.signInWithEmail).toHaveBeenCalledWith('user@example.com', 'pw123');
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/app/dashboard');
  });

  it('submit() does not navigate if sign-in fails (propagates error)', async () => {
    const err = new Error('bad creds');
    authMock.signInWithEmail.mockRejectedValueOnce(err);

    cmp.email = 'user@example.com';
    cmp.password = 'bad';

    await expect(cmp.submit()).rejects.toThrow('bad creds');
    expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
  });

  it('signInWithGoogle() signs in and navigates to /app', async () => {
    authMock.signInWithGoogle.mockResolvedValueOnce({ user: { uid: 'g1' } });
    routerMock.navigateByUrl.mockResolvedValueOnce(true);

    await cmp.signInWithGoogle();

    expect(authMock.signInWithGoogle).toHaveBeenCalled();
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/app/dashboard');
  });

  it('signInWithGoogle() does not navigate if popup fails', async () => {
    const err = new Error('popup closed');
    authMock.signInWithGoogle.mockRejectedValueOnce(err);

    await expect(cmp.signInWithGoogle()).rejects.toThrow('popup closed');
    expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
  });
});
