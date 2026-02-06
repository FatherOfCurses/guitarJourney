import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import type { DashboardData } from './dashboard.resolver';
import { CarouselService } from '../../services/carousel.service';
import { CarouselItem, ImageInfo, ImageVariants, Attribution } from '../../models/carousel';

/** Build a minimal CarouselItem for testing */
function makeItem(opts: {
  position?: number;
  alt?: string;
  imageUrl?: string;
  variants?: Partial<ImageVariants>;
} = {}): CarouselItem {
  const item = new CarouselItem();
  item.position = opts.position ?? 0;
  item.alt = opts.alt ?? 'test image';

  const img = new ImageInfo();
  img.url = opts.imageUrl ?? 'fallback.jpg';
  if (opts.variants) {
    const v = new ImageVariants();
    Object.assign(v, opts.variants);
    img.variants = v;
  }
  item.image = img;

  const attr = new Attribution();
  attr.title = 'Test';
  attr.creatorName = 'Tester';
  attr.sourceUrl = 'http://example.com';
  attr.license = 'CC BY 4.0';
  attr.licenseUrl = 'http://example.com/license';
  item.attribution = attr;

  return item;
}

/** Flush resolved-promise microtasks so async constructor work completes */
async function flushPromises(): Promise<void> {
  await Promise.resolve();
  await Promise.resolve();
}

describe('DashboardComponent', () => {
  const DASHBOARD: DashboardData = {
    lastSession: {
      id: 'last-1',
      startedAt: new Date('2025-09-08T14:00:00-04:00'),
      durationMs: 45 * 60_000,
    },
    totals: { minutes: 120, sessionCount: 3, streakDays: 2 },
    week: {
      '2025-09-08': 15,
      '2025-09-09': 45,
    },
  };

  let mockCarouselService: { getCarouselItems: jest.Mock };

  function create(opts: {
    fixtureData?: Partial<DashboardData>;
    carouselItems?: CarouselItem[];
    carouselError?: Error;
  } = {}) {
    mockCarouselService = {
      getCarouselItems: opts.carouselError
        ? jest.fn().mockRejectedValue(opts.carouselError)
        : jest.fn().mockResolvedValue(opts.carouselItems ?? []),
    };

    TestBed.overrideComponent(DashboardComponent, {
      set: {
        // Avoid template dependencies; we're testing class logic/signals
        template: '<div></div>',
      },
    });

    const fixtureData = opts.fixtureData;
    TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              dashboard: fixtureData
                ? ({
                    lastSession: fixtureData.lastSession ?? DASHBOARD.lastSession,
                    totals: fixtureData.totals ?? DASHBOARD.totals,
                    week: fixtureData.week ?? DASHBOARD.week,
                  } as DashboardData)
                : (DASHBOARD as DashboardData),
            }),
          },
        },
        { provide: CarouselService, useValue: mockCarouselService },
      ],
    });

    const fixture = TestBed.createComponent(DashboardComponent);
    const cmp = fixture.componentInstance;
    fixture.detectChanges();
    return { fixture, cmp };
  }

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  // ─── Resolver / dashboard data ────────────────────────────────

  it('creates and exposes resolver data via signal', () => {
    const { cmp } = create();
    const data = cmp.data();
    expect(data.totals.minutes).toBe(120);
    expect(data.lastSession?.id).toBe('last-1');
    expect(Object.keys(data.week).length).toBeGreaterThan(0);
  });

  it('computes weekTotal from week record', () => {
    const { cmp } = create();
    expect(cmp.weekTotal()).toBe(15 + 45);
  });

  it('returns 0 weekTotal when week is empty/undefined', () => {
    const { cmp } = create({ fixtureData: { week: {} } });
    expect(cmp.weekTotal()).toBe(0);

    // If resolver returned no dashboard object at all
    TestBed.resetTestingModule();
    TestBed.overrideComponent(DashboardComponent, { set: { template: '<div></div>' } });
    TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { data: of({}) } },
        { provide: CarouselService, useValue: { getCarouselItems: jest.fn().mockResolvedValue([]) } },
      ],
    });
    const fixture = TestBed.createComponent(DashboardComponent);
    const cmp2 = fixture.componentInstance;
    fixture.detectChanges();
    expect(cmp2.weekTotal()).toBe(0);
  });

  // ─── Carousel loading ─────────────────────────────────────────

  describe('Carousel loading', () => {
    it('fetches items for "dashboard-hero" on construction', () => {
      create();
      expect(mockCarouselService.getCarouselItems).toHaveBeenCalledWith('dashboard-hero');
    });

    it('populates carouselItems after load resolves', async () => {
      const items = [makeItem({ position: 0 }), makeItem({ position: 1 })];
      const { fixture, cmp } = create({ carouselItems: items });

      await flushPromises();
      fixture.detectChanges();

      expect(cmp.carouselItems()).toHaveLength(2);
    });

    it('logs error and keeps items empty when load fails', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const { fixture, cmp } = create({ carouselError: new Error('network') });

      await flushPromises();
      fixture.detectChanges();

      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to load carousel items:',
        expect.any(Error),
      );
      expect(cmp.carouselItems()).toHaveLength(0);
    });
  });

  // ─── currentItem computed ──────────────────────────────────────

  describe('currentItem', () => {
    it('returns the item at currentIndex', async () => {
      const items = [
        makeItem({ position: 0, alt: 'first' }),
        makeItem({ position: 1, alt: 'second' }),
      ];
      const { fixture, cmp } = create({ carouselItems: items });

      await flushPromises();
      fixture.detectChanges();

      expect(cmp.currentItem()?.alt).toBe('first');

      cmp.currentIndex.set(1);
      expect(cmp.currentItem()?.alt).toBe('second');
    });

    it('returns null when carouselItems is empty', () => {
      const { cmp } = create();
      expect(cmp.currentItem()).toBeNull();
    });
  });

  // ─── currentImage computed (fallback chain) ────────────────────

  describe('currentImage', () => {
    it('returns empty string when no current item', () => {
      const { cmp } = create();
      expect(cmp.currentImage()).toBe('');
    });

    it('prefers webpMd variant', async () => {
      const items = [makeItem({
        variants: { webpMd: 'webp-medium.webp', md: 'medium.jpg' },
        imageUrl: 'original.jpg',
      })];
      const { fixture, cmp } = create({ carouselItems: items });

      await flushPromises();
      fixture.detectChanges();

      expect(cmp.currentImage()).toBe('webp-medium.webp');
    });

    it('falls back to md when webpMd is absent', async () => {
      const items = [makeItem({
        variants: { md: 'medium.jpg' },
        imageUrl: 'original.jpg',
      })];
      const { fixture, cmp } = create({ carouselItems: items });

      await flushPromises();
      fixture.detectChanges();

      expect(cmp.currentImage()).toBe('medium.jpg');
    });

    it('falls back to image.url when no variants match', async () => {
      const items = [makeItem({ imageUrl: 'original.jpg' })];
      const { fixture, cmp } = create({ carouselItems: items });

      await flushPromises();
      fixture.detectChanges();

      expect(cmp.currentImage()).toBe('original.jpg');
    });
  });

  // ─── Navigation ────────────────────────────────────────────────

  describe('nextImage / prevImage', () => {
    it('nextImage advances and wraps around', async () => {
      const items = [
        makeItem({ position: 0 }),
        makeItem({ position: 1 }),
        makeItem({ position: 2 }),
      ];
      const { fixture, cmp } = create({ carouselItems: items });

      await flushPromises();
      fixture.detectChanges();

      expect(cmp.currentIndex()).toBe(0);

      cmp.nextImage();
      expect(cmp.currentIndex()).toBe(1);

      cmp.nextImage();
      expect(cmp.currentIndex()).toBe(2);

      cmp.nextImage();
      expect(cmp.currentIndex()).toBe(0); // wraps
    });

    it('prevImage decrements and wraps around', async () => {
      const items = [
        makeItem({ position: 0 }),
        makeItem({ position: 1 }),
        makeItem({ position: 2 }),
      ];
      const { fixture, cmp } = create({ carouselItems: items });

      await flushPromises();
      fixture.detectChanges();

      expect(cmp.currentIndex()).toBe(0);

      cmp.prevImage();
      expect(cmp.currentIndex()).toBe(2); // wraps to end

      cmp.prevImage();
      expect(cmp.currentIndex()).toBe(1);
    });

    it('nextImage is a no-op when items is empty', () => {
      const { cmp } = create();
      cmp.nextImage();
      expect(cmp.currentIndex()).toBe(0);
    });

    it('prevImage is a no-op when items is empty', () => {
      const { cmp } = create();
      cmp.prevImage();
      expect(cmp.currentIndex()).toBe(0);
    });
  });

  // ─── Auto-rotation ─────────────────────────────────────────────

  describe('rotation', () => {
    it('auto-rotates every 12 seconds', async () => {
      jest.useFakeTimers();
      const items = [
        makeItem({ position: 0 }),
        makeItem({ position: 1 }),
        makeItem({ position: 2 }),
      ];
      const { fixture, cmp } = create({ carouselItems: items });

      await flushPromises();
      fixture.detectChanges();

      expect(cmp.currentIndex()).toBe(0);

      jest.advanceTimersByTime(12_000);
      expect(cmp.currentIndex()).toBe(1);

      jest.advanceTimersByTime(12_000);
      expect(cmp.currentIndex()).toBe(2);

      jest.advanceTimersByTime(12_000);
      expect(cmp.currentIndex()).toBe(0); // wraps

      fixture.destroy();
    });

    it('does not rotate when only one item', async () => {
      jest.useFakeTimers();
      const items = [makeItem({ position: 0 })];
      const { fixture, cmp } = create({ carouselItems: items });

      await flushPromises();
      fixture.detectChanges();

      jest.advanceTimersByTime(24_000);
      expect(cmp.currentIndex()).toBe(0); // never changed

      fixture.destroy();
    });

    it('ngOnDestroy clears the rotation interval', async () => {
      jest.useFakeTimers();
      const clearSpy = jest.spyOn(window, 'clearInterval');
      const items = [makeItem({ position: 0 }), makeItem({ position: 1 })];
      const { fixture } = create({ carouselItems: items });

      await flushPromises();
      fixture.detectChanges();

      fixture.destroy(); // triggers ngOnDestroy
      expect(clearSpy).toHaveBeenCalled();
    });
  });

  // ─── Hover state ───────────────────────────────────────────────

  describe('hover state', () => {
    it('onImageMouseEnter sets isHovering to true', () => {
      const { cmp } = create();
      expect(cmp.isHovering()).toBe(false);

      cmp.onImageMouseEnter();
      expect(cmp.isHovering()).toBe(true);
    });

    it('onImageMouseLeave sets isHovering to false', () => {
      const { cmp } = create();
      cmp.onImageMouseEnter();
      cmp.onImageMouseLeave();
      expect(cmp.isHovering()).toBe(false);
    });
  });
});
