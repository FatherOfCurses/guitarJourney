import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RegisterComponent } from './register.component';

// ---- Mock @angular/fire/auth (define inside factory due to Jest hoisting) ----
jest.mock('@angular/fire/auth', () => {
  // capture auth state callback so tests can emit
  const onAuthStateChanged = jest.fn((_auth: any, cb: (u: any) => void) => {
    (onAuthStateChanged as any).__cb = cb;
    return () => {}; // unsubscribe noop
  });
  (onAuthStateChanged as any).__emit = (u: any) =>
    (onAuthStateChanged as any).__cb?.(u);

  const createUserWithEmailAndPassword = jest.fn();
  const updateProfile = jest.fn();
  const signInWithPopup = jest.fn();
  const GoogleAuthProvider = jest.fn().mockImplementation(() => ({}));

  class FakeAuth {}

  return {
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    updateProfile,
    signInWithPopup,
    GoogleAuthProvider,
    Auth: FakeAuth,
  };
});

// Import mocked tokens/functions for assertions/types
import {
  Auth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
} from '@angular/fire/auth';

describe('RegisterComponent', () => {
  let fixture: any;
  let cmp: RegisterComponent;

  const routerMock = {
    navigate: jest.fn<Promise<boolean>, any[]>().mockResolvedValue(true),
  };

  // Provide a concrete instance for the Auth injection token
  const fakeAuth = new (Auth as any)() as Auth;

  beforeEach(() => {
    jest.clearAllMocks();

    TestBed.configureTestingModule({
      imports: [RegisterComponent], // standalone; brings ReactiveForms providers
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: Auth, useValue: fakeAuth },
      ],
    });

    // Avoid fetching templateUrl during tests – we don't need DOM here
    TestBed.overrideComponent(RegisterComponent, { set: { template: '' } });

    fixture = TestBed.createComponent(RegisterComponent);
    cmp = fixture.componentInstance;
  });

  function fillForm(values: {
    email?: string;
    password?: string;
    confirmPassword?: string;
    displayName?: string;
  }) {
    const { email = '', password = '', confirmPassword = '', displayName = '' } = values;
    cmp.form.patchValue({ email, password, confirmPassword, displayName });
  }

  it('creates and initializes signals/form', () => {
    expect(cmp).toBeTruthy();
    expect(cmp.loading()).toBe(false);
    expect(cmp.error()).toBeNull();
    expect(cmp.form.valid).toBe(false); // empty by default
  });

  it('wires onAuthStateChanged in ctor and navigates to /app when a user appears', async () => {
    // Emit a user via our mock helper; should trigger navigate(['/app'])
    (onAuthStateChanged as any).__emit({ uid: 'u123' });
    expect(routerMock.navigate).toHaveBeenCalledWith(['/app']);
  });

  it('submit() early-returns on invalid form (no loading, no auth calls)', async () => {
    // Invalid: leave defaults (empty) so required validators fail
    await cmp.submit();
    expect(createUserWithEmailAndPassword).not.toHaveBeenCalled();
    expect(cmp.loading()).toBe(false);
    // touched state should be set by markAllAsTouched()
    expect(cmp.form.touched).toBe(true);
  });

  it('submit() registers and updates displayName when provided, then navigates to /app', async () => {
    const cred = { user: { uid: 'U1' } };
    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValueOnce(cred);
    (updateProfile as jest.Mock).mockResolvedValueOnce(undefined);

    fillForm({
      email: 'new@user.com',
      password: 'strongpass',
      confirmPassword: 'strongpass',
      displayName: 'New User',
    });

    await cmp.submit();

    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
      fakeAuth,
      'new@user.com',
      'strongpass'
    );
    expect(updateProfile).toHaveBeenCalledWith(cred.user, { displayName: 'New User' });
    expect(routerMock.navigate).toHaveBeenLastCalledWith(['/app']);
    expect(cmp.error()).toBeNull();
    expect(cmp.loading()).toBe(false);
  });

  it('submit() registers without displayName (no updateProfile), then navigates to /app', async () => {
    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({ user: { uid: 'U2' } });

    fillForm({
      email: 'plain@user.com',
      password: 'strongpass',
      confirmPassword: 'strongpass',
      displayName: '', // explicit empty string
    });

    await cmp.submit();

    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
      fakeAuth,
      'plain@user.com',
      'strongpass'
    );
    expect(updateProfile).not.toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenLastCalledWith(['/app']);
    expect(cmp.error()).toBeNull();
    expect(cmp.loading()).toBe(false);
  });

  it.each([
    ['auth/email-already-in-use', 'That email is already in use.'],
    ['auth/weak-password', 'Please choose a stronger password (8+ characters).'],
    ['auth/invalid-email', 'Please enter a valid email address.'],
    ['some/other', 'Could not create your account. Please try again.'],
  ])('submit() maps error code %p to message', async (code, expectedMsg) => {
    (createUserWithEmailAndPassword as jest.Mock).mockRejectedValueOnce({ code });

    fillForm({
      email: 'boom@user.com',
      password: 'strongpass',
      confirmPassword: 'strongpass',
      displayName: 'X',
    });

    await cmp.submit();

    expect(routerMock.navigate).not.toHaveBeenCalled();
    expect(cmp.error()).toBe(expectedMsg);
    expect(cmp.loading()).toBe(false);
  });

  it('google() signs in with popup and navigates to /app', async () => {
    (signInWithPopup as jest.Mock).mockResolvedValueOnce({ user: { uid: 'G1' } });

    await cmp.google();

    expect(GoogleAuthProvider).toHaveBeenCalledTimes(1);
    expect(signInWithPopup).toHaveBeenCalledWith(fakeAuth, expect.any(Object));
    expect(routerMock.navigate).toHaveBeenCalledWith(['/app']);
    expect(cmp.error()).toBeNull();
    expect(cmp.loading()).toBe(false);
  });

  it('google() surfaces error and does not navigate on failure', async () => {
    (signInWithPopup as jest.Mock).mockRejectedValueOnce(new Error('popup closed'));

    await cmp.google();

    expect(routerMock.navigate).not.toHaveBeenCalled();
    expect(cmp.error()).toBe('Google sign-in failed. Please try again.');
    expect(cmp.loading()).toBe(false);
  });
});
