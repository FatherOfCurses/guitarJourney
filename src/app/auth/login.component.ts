// auth/login.component.ts
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from './auth.service';

@Component({
  standalone: true,
  imports: [FormsModule],
  template: './login.component.html',

})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  email = '';
  password = '';

  async submit() {
    await this.auth.signInWithGoogle();
    this.router.navigateByUrl('/app');
  }
}
