import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

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

  const activatedRouteMock = {
    snapshot: {
      queryParamMap: {
        get: jest.fn().mockReturnValue(null),
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();

    TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    });

    TestBed.overrideComponent(LoginComponent, { set: { template: '' } });

    fixture = TestBed.createComponent(LoginComponent);
    cmp = fixture.componentInstance;
  });

  it('creates with empty credentials', () => {
    expect(cmp).toBeTruthy();
    expect(cmp.email).toBe('');
    expect(cmp.password).toBe('');
  });

  it('signInWithEmail signs in and navigates to /app by default', async () => {
    authMock.signInWithEmail.mockReturnValueOnce(of({ user: { uid: 'u1' } }));
    routerMock.navigateByUrl.mockResolvedValueOnce(true);

    cmp.email = 'user@example.com';
    cmp.password = 'pw123';

    await cmp.signInWithEmail();

    expect(authMock.signInWithEmail).toHaveBeenCalledWith('user@example.com', 'pw123');
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/app');
  });

  it('signInWithEmail does not navigate if sign-in fails', async () => {
    authMock.signInWithEmail.mockReturnValueOnce(throwError(() => new Error('bad creds')));

    cmp.email = 'user@example.com';
    cmp.password = 'bad';

    await expect(cmp.signInWithEmail()).rejects.toThrow('bad creds');
    expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
  });

  it('signInWithGoogle signs in and navigates to /app', async () => {
    authMock.signInWithGoogle.mockReturnValueOnce(of({ user: { uid: 'g1' } }));
    routerMock.navigateByUrl.mockResolvedValueOnce(true);

    await cmp.signInWithGoogle();

    expect(authMock.signInWithGoogle).toHaveBeenCalled();
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/app');
  });

  it('signInWithGoogle does not navigate if popup fails', async () => {
    authMock.signInWithGoogle.mockReturnValueOnce(throwError(() => new Error('popup closed')));

    await expect(cmp.signInWithGoogle()).rejects.toThrow('popup closed');
    expect(routerMock.navigateByUrl).not.toHaveBeenCalled();
  });

  it('navigates to redirect query param when present', async () => {
    activatedRouteMock.snapshot.queryParamMap.get.mockReturnValueOnce('/app/sessions');
    authMock.signInWithEmail.mockReturnValueOnce(of({ user: { uid: 'u1' } }));
    routerMock.navigateByUrl.mockResolvedValueOnce(true);

    cmp.email = 'user@example.com';
    cmp.password = 'pw123';

    await cmp.signInWithEmail();

    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/app/sessions');
  });
});
