// auth/auth.service.ts
import { Injectable, signal, computed } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user = signal<User | null>(null);
  user = computed(() => this._user());


  // wire up to your real backend later
  constructor(private auth: Auth) {
    onAuthStateChanged(this.auth, u => this._user.set(u));
  }

  signInWithGoogle() {
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }
  signOut() { return signOut(this.auth); }

  isAuthed() { return true};
}
