import { Component, computed, effect, inject, signal, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { DashboardData } from './dashboard.resolver';
import { CarouselService } from '../../services/carousel.service';
import { CarouselItem } from '../../models/carousel';

const EMPTY_DASHBOARD: DashboardData = {
  lastSession: undefined,
  recentSessions: [],
  totals: { minutes: 0, sessionCount: 0, streakDays: 0, weekSessionCount: 0 },
  week: {} as Record<string, number>,
  songsLearned: 0,
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe, DecimalPipe],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnDestroy {
  private route = inject(ActivatedRoute);
  private carouselService: CarouselService = inject(CarouselService);

  readonly data = toSignal(
    this.route.data.pipe(
      map(d => (d['dashboard'] as DashboardData) ?? EMPTY_DASHBOARD)
    ),
    { initialValue: EMPTY_DASHBOARD }
  );

  weekTotal = computed(() => {
    const w = this.data().week as Record<string, number> | undefined;
    if (!w) return 0;
    return (Object.values(w) as number[]).reduce((a, b) => a + b, 0);
  });

  hoursMinutes = computed(() => {
    const mins = this.data().totals.minutes;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  });

  // Carousel state (retained for future use; not rendered in current template)
  carouselItems = signal<CarouselItem[]>([]);
  currentIndex = signal(0);
  isHovering = signal(false);
  private rotationInterval?: number;

  currentItem = computed(() => {
    const items = this.carouselItems();
    return items.length > 0 ? items[this.currentIndex()] : null;
  });

  currentImage = computed(() => {
    const item = this.currentItem();
    if (!item) return '';
    return item.image.variants?.webpMd || item.image.variants?.md || item.image.url;
  });

  constructor() {
    this.loadCarousel();
    effect(() => {
      if (this.carouselItems().length > 0) this.startRotation();
    });
  }

  ngOnDestroy(): void {
    this.stopRotation();
  }

  private async loadCarousel(): Promise<void> {
    try {
      const items = await this.carouselService.getCarouselItems('dashboard-hero');
      this.carouselItems.set(items);
    } catch {
      // carousel is optional — fail silently
    }
  }

  private startRotation(): void {
    this.stopRotation();
    if (this.carouselItems().length <= 1) return;
    this.rotationInterval = window.setInterval(() => {
      this.currentIndex.set((this.currentIndex() + 1) % this.carouselItems().length);
    }, 12000);
  }

  private stopRotation(): void {
    if (this.rotationInterval) {
      clearInterval(this.rotationInterval);
      this.rotationInterval = undefined;
    }
  }

  nextImage(): void {
    const items = this.carouselItems();
    if (items.length === 0) return;
    this.currentIndex.set((this.currentIndex() + 1) % items.length);
  }

  prevImage(): void {
    const items = this.carouselItems();
    if (items.length === 0) return;
    this.currentIndex.set((this.currentIndex() - 1 + items.length) % items.length);
  }

  onImageMouseEnter(): void { this.isHovering.set(true); }
  onImageMouseLeave(): void { this.isHovering.set(false); }
}
