import { Component, computed, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

interface DashboardData {
  lastSession: { id: string; startedAt: Date; durationMs: number } | null;
  totals: { minutes: number; sessionCount: number; streakDays: number };
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  imports: [DatePipe, DecimalPipe, RouterLink]
})
export class DashboardComponent {
  // rotating inspirational images (just placeholders for now)
  private images = [
    'https://placekitten.com/800/300',
    'https://picsum.photos/800/300',
  ];
  private currentIndex = signal(0);
  currentImage = computed(() => this.images[this.currentIndex()]);

  // --- mock dashboard data ---
  private mockData = signal<DashboardData>({
    lastSession: {
      id: 'mock-session-1',
      startedAt: new Date(Date.now() - 1000 * 60 * 60), // one hour ago
      durationMs: 45 * 60 * 1000, // 45 minutes
    },
    totals: {
      minutes: 1234,
      sessionCount: 56,
      streakDays: 12,
    },
  });

  data = this.mockData;

  weekTotal = computed(() => {
    // Hardcoded mock weekly total
    return 180; // minutes
  });

  constructor() {
    // Example: rotate image every 5s
    setInterval(() => {
      this.currentIndex.set((this.currentIndex() + 1) % this.images.length);
    }, 5000);
  }
}
