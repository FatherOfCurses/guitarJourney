import { Component, computed, signal, inject } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { DashboardData } from './dashboard.resolver';

const EMPTY_DASHBOARD: DashboardData = {
  lastSession: undefined,
  totals: { minutes: 0, sessionCount: 0, streakDays: 0 },
  week: {} as Record<string, number>,         
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  imports: [DatePipe, DecimalPipe, RouterLink, CommonModule]
})
export class DashboardComponent {
  private route = inject(ActivatedRoute);
  // Resolve data -> signal
  readonly data = toSignal(
    this.route.data.pipe(map(d => (d['dashboard'] as DashboardData) ?? {
      lastSession: undefined,
      totals: { minutes: 0, sessionCount: 0, streakDays: 0 },
      week: {}
    })),
    { initialValue: EMPTY_DASHBOARD }
  );

  weekTotal = computed(() => {
    const w = this.data().week as Record<string, number> | undefined;
    if (!w) return 0;
    const vals = Object.values(w) as number[]; // narrow from unknown[]
    return vals.reduce((a, b) => a + b, 0);
  });

  private images = [
    'https://placekitten.com/800/300',
    'https://picsum.photos/800/300',
  ];
  private currentIndex = signal(0);
  currentImage = computed(() => this.images[this.currentIndex()]);

  constructor() {
    // Example: rotate image every 5s
    setInterval(() => {
      this.currentIndex.set((this.currentIndex() + 1) % this.images.length);
    }, 5000);
  }
}

