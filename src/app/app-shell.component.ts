import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
// If you prefer PrimeNG's Menubar:
// import { Menubar } from 'primeng/menubar';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <!-- Sticky top bar -->
    <header class="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-neutral-200">
      <nav class="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <a routerLink="/" class="font-semibold">Guitar Journey</a>

        <ul class="flex items-center gap-6">
          <li><a routerLink="/sessions" routerLinkActive="text-indigo-600" class="hover:text-indigo-600">Sessions</a></li>
          <li><a routerLink="/songs"    routerLinkActive="text-indigo-600" class="hover:text-indigo-600">Songs</a></li>
          <li><a routerLink="/metrics"  routerLinkActive="text-indigo-600" class="hover:text-indigo-600">Metrics</a></li>
        </ul>

        <!-- Example: simple profile menu toggle via a signal -->
        <div class="relative">
          <button class="rounded-xl px-3 py-1.5 hover:bg-neutral-100">Profile</button>
          <!-- dropdown, notifications, etc. -->
        </div>
      </nav>
    </header>

    <!-- Page content -->
    <main class="mx-auto max-w-6xl px-4 py-6">
      <router-outlet />
    </main>
  `,
})
export class AppShellComponent {}
