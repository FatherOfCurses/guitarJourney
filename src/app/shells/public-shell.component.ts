// shells/public-shell.component.ts
import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'gj-public-shell',
  imports: [RouterOutlet, RouterLink],
  template: `
    <header class="sticky top-0 z-50 bg-[var(--gj-background)]/90 backdrop-blur border-b border-[var(--gj-border)]">
      <nav class="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <a routerLink="/" class="font-semibold text-[var(--gj-text)]">Guitar Journey</a>
        <a routerLink="/login" class="rounded px-3 py-1.5 text-[var(--gj-text)] hover:bg-[var(--gj-border)]">Sign in</a>
      </nav>
    </header>
    <main class="mx-auto max-w-6xl px-4 py-8">
      <router-outlet/>
    </main>
    <footer class="border-t border-[var(--gj-border)] mt-12 py-6 text-center text-sm text-[var(--gj-muted)]">
      © {{ currentYear }} Guitar Journey
    </footer>
  `,
})
export class PublicShellComponent {
  currentYear: number = new Date().getFullYear();
}
