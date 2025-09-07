import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

// ---- Mock @angular/fire/auth (all mocks defined INSIDE the factory) ----
jest.mock('@angular/fire/auth', () => {
  // Local factory scope — safe with Jest hoisting
  const onAuthStateChanged = jest.fn((_auth: any, cb: (u: any) => void) => {
    (onAuthStateChanged as any).__cb = cb;
    // Return unsubscribe noop
    return () => {};
  });
  (onAuthStateChanged as any).__emit = (u: any) =>
    (onAuthStateChanged as any).__cb?.(u);

  const signInWithPopup = jest.fn();
  const signInWithEmailAndPassword = jest.fn();
  const createUserWithEmailAndPassword = jest.fn();
  const sendPasswordResetEmail = jest.fn();
  const updateProfile = jest.fn();
  const signOut = jest.fn();
  const getIdToken = jest.fn();

  const GoogleAuthProvider = jest.fn().mockImplementation(() => ({}));

  class FakeAuth {} // token used for DI

  return {
    onAuthStateChanged,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    updateProfile,
    signOut,
    getIdToken,
    GoogleAuthProvider,
    Auth: FakeAuth,
  };
});

// Import the mocked symbols so we can assert on them
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  signOut as fbSignOut,
  getIdToken,
  GoogleAuthProvider,
  Auth,
  User,
} from '@angular/fire/auth';

describe('AuthService', () => {
  let service: AuthService;
  const mockAuth = new (Auth as any)() as Auth; // instance of our FakeAuth

  beforeEach(() => {
    jest.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [{ provide: Auth, useValue: mockAuth }, AuthService],
    });
    service = TestBed.inject(AuthService);
  });

  function emitUser(u: Partial<User> | null) {
    (onAuthStateChanged as any).__emit(u as User | null);
  }

  it('wires onAuthStateChanged in the constructor and updates signals', () => {
    expect(onAuthStateChanged).toHaveBeenCalledTimes(1);
    expect(onAuthStateChanged).toHaveBeenCalledWith(mockAuth, expect.any(Function));

    // Initially null
    expect(service.user()).toBeNull();
    expect(service.isAuthed()).toBe(false);

    // Emit a user and verify signals
    const u = { uid: 'abc123', displayName: 'Colin', email: 'c@example.com' } as User;
    emitUser(u);
    expect(service.user()).toEqual(u);
    expect(service.isAuthed()).toBe(true);
  });

  it('signInWithGoogle calls signInWithPopup with GoogleAuthProvider', async () => {
    (signInWithPopup as jest.Mock).mockResolvedValueOnce({ user: { uid: 'g1' } });
    await service.signInWithGoogle();
    expect(GoogleAuthProvider).toHaveBeenCalledTimes(1);
    expect(signInWithPopup).toHaveBeenCalledWith(mockAuth, expect.any(Object));
  });

  it('signInWithEmail delegates to signInWithEmailAndPassword', async () => {
    (signInWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({ user: { uid: 'e1' } });
    await service.signInWithEmail('x@y.z', 'pw');
    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(mockAuth, 'x@y.z', 'pw');
  });

  it('registerWithEmail creates user and (with displayName) updates profile & sets local signal', async () => {
    const cred = { user: { uid: 'u1', displayName: null, email: 'z@z.z' } } as any;
    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValueOnce(cred);
    (updateProfile as jest.Mock).mockResolvedValueOnce(undefined);

    expect(service.user()).toBeNull();

    const result = await service.registerWithEmail('z@z.z', 'pw', 'Zed');
    expect(result).toBe(cred);
    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(mockAuth, 'z@z.z', 'pw');
    expect(updateProfile).toHaveBeenCalledWith(cred.user, { displayName: 'Zed' });

    expect(service.user()).toEqual(expect.objectContaining({ uid: 'u1' }));
    expect(service.uid).toBe('u1');
  });

  it('registerWithEmail skips updateProfile and does not set signal when no displayName', async () => {
    const cred = { user: { uid: 'u2', displayName: null, email: 'n@n.n' } } as any;
    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValueOnce(cred);

    emitUser(null); // ensure starting state
    await service.registerWithEmail('n@n.n', 'pw');
    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(mockAuth, 'n@n.n', 'pw');
    expect(updateProfile).not.toHaveBeenCalled();
    expect(service.user()).toBeNull();
  });

  it('sendPasswordReset delegates to sendPasswordResetEmail', async () => {
    (sendPasswordResetEmail as jest.Mock).mockResolvedValueOnce(undefined);
    await service.sendPasswordReset('reset@ex.com');
    expect(sendPasswordResetEmail).toHaveBeenCalledWith(mockAuth, 'reset@ex.com');
  });

  it('signOut delegates to Firebase signOut', async () => {
    (fbSignOut as jest.Mock).mockResolvedValueOnce(undefined);
    await service.signOut();
    expect(fbSignOut).toHaveBeenCalledWith(mockAuth);
  });

  it('getters return values when user present, null otherwise', () => {
    emitUser(null);
    expect(service.uid).toBeNull();
    expect(service.displayName).toBeNull();
    expect(service.email).toBeNull();

    const u = { uid: 'ux', displayName: 'Name', email: 'e@e.e' } as User;
    emitUser(u);
    expect(service.uid).toBe('ux');
    expect(service.displayName).toBe('Name');
    expect(service.email).toBe('e@e.e');
  });

  it('idToken returns null when no user; returns token and honors forceRefresh when authed', async () => {
    emitUser(null);
    await expect(service.idToken()).resolves.toBeNull();

    const u = { uid: 'tok', displayName: 'T', email: 't@t.t' } as User;
    emitUser(u);
    (getIdToken as jest.Mock).mockResolvedValueOnce('JWT123');
    await expect(service.idToken(true)).resolves.toBe('JWT123');
    expect(getIdToken).toHaveBeenCalledWith(u, true);
  });
});
