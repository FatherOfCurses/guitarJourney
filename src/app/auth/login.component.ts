// auth/login.component.ts
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from './auth.service'; 

@Component({
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',

})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute)
  email = '';
  password = '';

  async signInWithGoogle() {
    await this.auth.signInWithGoogle().toPromise();
    this.goWhereIntended();
  }

  async signInWithEmail() {
    await this.auth.signInWithEmail(this.email, this.password).toPromise();
    this.goWhereIntended();
  }

  private goWhereIntended() {
    const redirect = this.route.snapshot.queryParamMap.get('redirect') || '/app';
    this.router.navigateByUrl(redirect);
  }

  


}
