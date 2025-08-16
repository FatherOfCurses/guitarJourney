// shells/public-shell.component.ts
import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'gj-public-shell',
  imports: [RouterOutlet, RouterLink],
  template: `
    <header class="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
      <nav class="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <a routerLink="/" class="font-semibold">Guitar Journey</a>
        <a routerLink="/login" class="rounded px-3 py-1.5 hover:bg-neutral-100">Sign in</a>
      </nav>
    </header>
    <main class="mx-auto max-w-6xl px-4 py-8">
      <router-outlet/>
    </main>
    <footer class="border-t mt-12 py-6 text-center text-sm text-neutral-500">
      © {{ currentYear }} Guitar Journey
    </footer>
  `,
})
export class PublicShellComponent {
  currentYear: number = new Date().getFullYear();
}
