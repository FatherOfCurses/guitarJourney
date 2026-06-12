import { Component, signal, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgClass } from '@angular/common';
import { Auth, signOut } from '@angular/fire/auth';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [NgClass, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app-shell.component.html',
})
export class AppShellComponent {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  collapsed = signal(false);

  readonly navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'pi pi-home',        route: '/app/dashboard' },
    { label: 'Sessions',  icon: 'pi pi-clock',       route: '/app/sessions'  },
    { label: 'Songs',     icon: 'pi pi-headphones',  route: '/app/songs'     },
    { label: 'Metrics',   icon: 'pi pi-chart-bar',   route: '/app/metrics'   },
  ];

  toggleSidebar() {
    this.collapsed.update(v => !v);
  }

  async onSignOut() {
    try {
      await signOut(this.auth);
    } finally {
      this.router.navigate(['/']);
    }
  }
}
