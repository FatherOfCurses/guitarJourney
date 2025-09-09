import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

// Adjust path if needed
import { DashboardComponent } from './dashboard.component';
import type { DashboardData } from './dashboard.resolver';

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

  function create(fixtureData?: Partial<DashboardData>) {
    TestBed.overrideComponent(DashboardComponent, {
      set: {
        // Avoid template dependencies; we’re testing class logic/signals
        template: '<div></div>',
      },
    });

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
    const { cmp } = create({ week: {} });
    expect(cmp.weekTotal()).toBe(0);

    // If resolver returned no dashboard object at all
    TestBed.resetTestingModule();
    TestBed.overrideComponent(DashboardComponent, { set: { template: '<div></div>' } });
    TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [{ provide: ActivatedRoute, useValue: { data: of({}) } }],
    });
    const fixture = TestBed.createComponent(DashboardComponent);
    const cmp2 = fixture.componentInstance;
    fixture.detectChanges();
    expect(cmp2.weekTotal()).toBe(0);
  });


});
