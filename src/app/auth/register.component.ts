import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AbstractControl, ValidationErrors, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';


import { Auth, createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, updateProfile } from '@angular/fire/auth';

// PrimeNG (standalone components/directives)
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { MessageModule } from 'primeng/message';

function matchPasswords(ctrl: AbstractControl): ValidationErrors | null {
  const pwd = ctrl.get('password')?.value;
  const cfm = ctrl.get('confirmPassword')?.value;
  return pwd && cfm && pwd !== cfm ? { passwordsDontMatch: true } : null;
}

@Component({
  standalone: true,
  selector: 'app-register',
  templateUrl: './register.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,

    // PrimeNG
    InputTextModule,
    PasswordModule,
    ButtonModule,
    DividerModule,
    MessageModule
  ]
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  loading = signal(false);
  error = signal<string | null>(null);

  form = this.fb.group(
    {
      displayName: ['', [Validators.maxLength(80)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    },
    { validators: matchPasswords }
  );

  get displayName() { return this.form.controls.displayName; }
  get email() { return this.form.controls.email; }
  get password() { return this.form.controls.password; }
  get confirmPassword() { return this.form.controls.confirmPassword; }

  constructor() {
    // If already signed in, route into the app
    onAuthStateChanged(this.auth, u => { if (u) this.router.navigate(['/sessions']); });
  }

  async submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.error.set(null);

    const { email, password, displayName } = this.form.value;

    try {
      const cred = await createUserWithEmailAndPassword(this.auth, email!, password!);
      if (displayName) {
        await updateProfile(cred.user, { displayName: displayName! });
      }
      await this.router.navigate(['/sessions']);
    } catch (e: any) {
      const msg =
        e?.code === 'auth/email-already-in-use' ? 'That email is already in use.' :
        e?.code === 'auth/weak-password' ? 'Please choose a stronger password (8+ characters).' :
        e?.code === 'auth/invalid-email' ? 'Please enter a valid email address.' :
        'Could not create your account. Please try again.';
      this.error.set(msg);
      console.error(e);
    } finally {
      this.loading.set(false);
    }
  }

  async google() {
    this.loading.set(true);
    this.error.set(null);
    try {
      await signInWithPopup(this.auth, new GoogleAuthProvider());
      await this.router.navigate(['/sessions']);
    } catch (e) {
      this.error.set('Google sign-in failed. Please try again.');
      console.error(e);
    } finally {
      this.loading.set(false);
    }
  }
}
