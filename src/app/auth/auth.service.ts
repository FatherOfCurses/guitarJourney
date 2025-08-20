// src/app/auth/auth.service.ts
import { Injectable, computed, signal } from '@angular/core';
import {
  Auth,
  User,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut as fbSignOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  getIdToken
} from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user = signal<User | null>(null);
  /** Current Firebase user (signal) */
  readonly user = computed(() => this._user());
  /** True if signed in */
  readonly isAuthed = computed(() => this._user() !== null);

  constructor(private auth: Auth) {
    onAuthStateChanged(this.auth, (u) => this._user.set(u));
  }

  /** Google OAuth sign-in (popup) */
  signInWithGoogle() {
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  /** Email + password sign-in */
  signInWithEmail(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  /** Create account with email + password (optional displayName) */
  async registerWithEmail(email: string, password: string, displayName?: string) {
    const cred = await createUserWithEmailAndPassword(this.auth, email, password);
    if (displayName) {
      await updateProfile(cred.user, { displayName });
      // onAuthStateChanged will update the signal automatically,
      // but we can also set it to reflect the displayName immediately:
      this._user.set({ ...cred.user } as User);
    }
    return cred;
  }

  /** Send password reset email */
  sendPasswordReset(email: string) {
    return sendPasswordResetEmail(this.auth, email);
  }

  /** Sign out */
  signOut() {
    return fbSignOut(this.auth);
  }

  /** Convenience getters */
  get uid(): string | null { return this._user()?.uid ?? null; }
  get displayName(): string | null { return this._user()?.displayName ?? null; }
  get email(): string | null { return this._user()?.email ?? null; }

  /** Fetch ID token (e.g., for calling your backend) */
  async idToken(forceRefresh = false): Promise<string | null> {
    const u = this._user();
    return u ? getIdToken(u, forceRefresh) : null;
  }
}
