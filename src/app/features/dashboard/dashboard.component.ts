import { Component, computed, effect, inject, signal, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { DashboardData } from './dashboard.resolver';
import { CarouselService } from '../../services/carousel.service';
import { CarouselItem } from '../../models/carousel'; // Ensure this file exists at the specified path

const EMPTY_DASHBOARD: DashboardData = {
  lastSession: undefined,
  totals: { minutes: 0, sessionCount: 0, streakDays: 0 },
  week: {} as Record<string, number>,
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

  // Dashboard data from resolver
  readonly data = toSignal(
    this.route.data.pipe(
      map(d => (d['dashboard'] as DashboardData) ?? EMPTY_DASHBOARD)
    ),
    { initialValue: EMPTY_DASHBOARD }
  );

  // Week total computed from dashboard data
  weekTotal = computed(() => {
    const w = this.data().week as Record<string, number> | undefined;
    if (!w) return 0;
    const vals = Object.values(w) as number[];
    return vals.reduce((a, b) => a + b, 0);
  });

  // Carousel state
  carouselItems = signal<CarouselItem[]>([]);
  currentIndex = signal(0);
  isHovering = signal(false);
  private rotationInterval?: number;

  // Current carousel item (computed)
  currentItem = computed(() => {
    const items = this.carouselItems();
    const index = this.currentIndex();
    return items.length > 0 ? items[index] : null;
  });

  // Current image URL (computed)
  currentImage = computed(() => {
    const item = this.currentItem();
    if (!item) return '';
    
    // Prefer WebP medium variant, fall back to URL
    return item.image.variants?.webpMd || 
           item.image.variants?.md || 
           item.image.url;
  });

  constructor() {
    // Load carousel items
    this.loadCarousel();

    // Start rotation effect
    effect(() => {
      const items = this.carouselItems();
      if (items.length > 0) {
        this.startRotation();
      }
    });
  }

  ngOnDestroy(): void {
    this.stopRotation();
  }

  private async loadCarousel(): Promise<void> {
    try {
      const items = await this.carouselService.getCarouselItems('dashboard-hero');
      this.carouselItems.set(items);
    } catch (error) {
      console.error('Failed to load carousel items:', error);
      // Could set a fallback or show error state
    }
  }

  private startRotation(): void {
    this.stopRotation(); // Clear any existing interval

    const items = this.carouselItems();
    if (items.length <= 1) return; // No rotation needed for single item

    // Default rotation interval: 6 seconds (6000ms)
    // You could pull this from Firestore carousel config if needed
    this.rotationInterval = window.setInterval(() => {
      const nextIndex = (this.currentIndex() + 1) % items.length;
      this.currentIndex.set(nextIndex);
    }, 6000);
  }

  private stopRotation(): void {
    if (this.rotationInterval) {
      clearInterval(this.rotationInterval);
      this.rotationInterval = undefined;
    }
  }

  // Manual navigation (for optional prev/next buttons)
  nextImage(): void {
    const items = this.carouselItems();
    if (items.length === 0) return;
    const nextIndex = (this.currentIndex() + 1) % items.length;
    this.currentIndex.set(nextIndex);
  }

  prevImage(): void {
    const items = this.carouselItems();
    if (items.length === 0) return;
    const prevIndex = (this.currentIndex() - 1 + items.length) % items.length;
    this.currentIndex.set(prevIndex);
  }

  // Hover state management for attribution overlay
  onImageMouseEnter(): void {
    this.isHovering.set(true);
  }

  onImageMouseLeave(): void {
    this.isHovering.set(false);
  }
}