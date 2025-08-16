// auth/auth.service.ts
import { Injectable, signal, computed } from '@angular/core';

export interface User {
  id: string;
  name: string;
  // … add whatever you need
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user = signal<User | null>(null);
  user = computed(() => this._user());

  // wire up to your real backend later
  login = async (email: string, password: string) => {
    // fake:
    this._user.set({ id: 'u1', name: 'Guitarist' });
  };

  logout = () => this._user.set(null);
  isAuthed = computed(() => !!this._user());
}
