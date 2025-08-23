import { Component, signal, ViewChild, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { TieredMenu, TieredMenuModule } from 'primeng/tieredmenu';
import { ButtonModule } from 'primeng/button';
import { Auth, signOut } from '@angular/fire/auth';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, MenubarModule, TieredMenuModule, ButtonModule],
  templateUrl: './app-shell.component.html',
})
export class AppShellComponent {
  @ViewChild('userMenu') userMenu!: TieredMenu;

  // Top-level nav
  readonly items = signal<MenuItem[]>([
    { label: 'Sessions', icon: 'pi pi-clock', routerLink: ['sessions'] },
    { label: 'Songs',    icon: 'pi pi-music', routerLink: ['songs'] },
    { label: 'Metrics',  icon: 'pi pi-chart-bar', routerLink: ['metrics'] },
  ]);

  // User dropdown items
  readonly userItems = signal<MenuItem[]>([
    { label: 'My Profile', icon: 'pi pi-user',   routerLink: ['/profile'] },
    { label: 'Settings',   icon: 'pi pi-cog',    routerLink: ['/settings'] },
    { separator: true },
    { label: 'Sign out',   icon: 'pi pi-sign-out', command: () => this.onSignOut() },
  ]);

  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  async onSignOut() {
    try {
      await signOut(this.auth);
    } finally {
      this.router.navigate(['/']);
    }
  }

  toggleUserMenu(event: Event) {
    this.userMenu.toggle(event);
  }
}
