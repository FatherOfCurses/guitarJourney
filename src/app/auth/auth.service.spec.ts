import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

// ---- Mock @angular/fire/auth ----
jest.mock('@angular/fire/auth', () => {
  const signInWithPopup = jest.fn();
  const signInWithEmailAndPassword = jest.fn();
  const createUserWithEmailAndPassword = jest.fn();
  const sendPasswordResetEmail = jest.fn();
  const updateProfile = jest.fn();
  const signOut = jest.fn();
  const getIdToken = jest.fn();

  const GoogleAuthProvider = jest.fn().mockImplementation(() => ({}));

  class FakeAuth {}

  return {
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

import {
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
  let mockAuth: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockAuth = new (Auth as any)();
    TestBed.configureTestingModule({
      providers: [{ provide: Auth, useValue: mockAuth }, AuthService],
    });
    service = TestBed.inject(AuthService);
  });

  /** Set the private _user signal directly for testing */
  function setUser(u: User | null) {
    (service as any)._user.set(u);
  }

  it('initially has null user and isAuthed false', () => {
    expect(service.user()).toBeNull();
    expect(service.isAuthed()).toBe(false);
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
  });

  it('registerWithEmail skips updateProfile and does not set signal when no displayName', async () => {
    const cred = { user: { uid: 'u2', displayName: null, email: 'n@n.n' } } as any;
    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValueOnce(cred);

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

  it('uid() returns auth.currentUser uid or null', () => {
    expect(service.uid()).toBeNull();

    mockAuth.currentUser = { uid: 'ux' };
    expect(service.uid()).toBe('ux');

    mockAuth.currentUser = null;
    expect(service.uid()).toBeNull();
  });

  it('displayName and email getters use the _user signal', () => {
    expect(service.displayName).toBeNull();
    expect(service.email).toBeNull();

    const u = { uid: 'ux', displayName: 'Name', email: 'e@e.e' } as User;
    setUser(u);
    expect(service.displayName).toBe('Name');
    expect(service.email).toBe('e@e.e');

    setUser(null);
    expect(service.displayName).toBeNull();
    expect(service.email).toBeNull();
  });

  it('idToken returns null when no user; returns token when user present', async () => {
    expect(await service.idToken()).toBeNull();

    const u = { uid: 'tok', displayName: 'T', email: 't@t.t' } as User;
    setUser(u);
    (getIdToken as jest.Mock).mockResolvedValueOnce('JWT123');
    await expect(service.idToken(true)).resolves.toBe('JWT123');
    expect(getIdToken).toHaveBeenCalledWith(u, true);
  });
});
