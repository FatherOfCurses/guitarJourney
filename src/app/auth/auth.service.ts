// src/app/auth/auth.service.ts
import { Injectable, computed, inject, signal, EnvironmentInjector, runInInjectionContext } from '@angular/core';
import {
  Auth,
  User,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  getIdToken
} from '@angular/fire/auth';
import { from } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  private injector = inject(EnvironmentInjector);
  private _user = signal<User | null>(null);
  /** Current Firebase user (signal) */
  readonly user = computed(() => this._user());
  /** True if signed in */
  readonly isAuthed = computed(() => this._user() !== null);
  uid() { return this.auth.currentUser?.uid ?? null; }


  /** Google OAuth sign-in (popup) */
  signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    return from(runInInjectionContext(this.injector, () => signInWithPopup(this.auth, provider)));
  }

  signInWithEmail(email: string, password: string) {
    return from(runInInjectionContext(this.injector, () => signInWithEmailAndPassword(this.auth, email, password)));
  }

  /** Create account with email + password (optional displayName) */
  async registerWithEmail(email: string, password: string, displayName?: string) {
    const cred = await runInInjectionContext(this.injector, () => createUserWithEmailAndPassword(this.auth, email, password));
    if (displayName) {
      await updateProfile(cred.user, { displayName });
      this._user.set({ ...cred.user } as User);
    }
    return cred;
  }

  /** Send password reset email */
  sendPasswordReset(email: string) {
    return runInInjectionContext(this.injector, () => sendPasswordResetEmail(this.auth, email));
  }

  /** Sign out */
  signOut() {
    return from(runInInjectionContext(this.injector, () => signOut(this.auth)));
  }

  /** Convenience getters */

  get displayName(): string | null { return this._user()?.displayName ?? null; }
  get email(): string | null { return this._user()?.email ?? null; }

  /** Fetch ID token (e.g., for calling your backend) */
  async idToken(forceRefresh = false): Promise<string | null> {
    const u = this._user();
    return u ? getIdToken(u, forceRefresh) : null;
  }
}
