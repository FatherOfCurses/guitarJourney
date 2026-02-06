import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { DashboardResolver } from './dashboard.resolver';

// Tokens to satisfy DI
import { Firestore } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

// ---- Mock AngularFire modules (functions used by resolver) ----
jest.mock('@angular/fire/auth', () => {
  const actual = jest.requireActual('@angular/fire/auth');
  return {
    ...actual,
    authState: jest.fn(),
    Auth: class {},
  };
});

jest.mock('@angular/fire/firestore', () => {
  // Minimal stand-ins for the functions the resolver calls
  return {
    Firestore: class {},
    collection: jest.fn(() => ({ withConverter: jest.fn().mockReturnThis() })),
    query: jest.fn(() => ({})),
    orderBy: jest.fn(() => ({})),
    limit: jest.fn(() => ({})),
    getDocs: jest.fn(),
  };
});

import { authState } from '@angular/fire/auth';
import { collection, query, orderBy, limit, getDocs } from '@angular/fire/firestore';

describe('DashboardResolver', () => {
  beforeAll(() => {
    // Stabilize "today" so streaks/week-bucketing are deterministic
    jest.useFakeTimers().setSystemTime(new Date('2025-09-08T12:00:00-04:00')); // Monday
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [
        DashboardResolver,
        { provide: Firestore, useValue: {} },
        { provide: Auth, useValue: {} },
      ],
    });
  });

  function mkDoc(id: string, ymd: string, minutes: number) {
    return {
      id,
      data: () =>
        ({
          date: { toDate: () => new Date(`${ymd}T14:00:00-04:00`) }, // 2pm local
          practiceTime: minutes,
        } as any),
    };
  }

  it('resolves dashboard data for an authed user (lastSession, totals, streak, week)', async () => {
    // Auth emits a user
    (authState as jest.Mock).mockReturnValue(of({ uid: 'u1' }));

    // Three sessions: Mon(9/08)=30m (today), Sun(9/07)=20m, Sat(9/06)=10m
    (getDocs as jest.Mock).mockResolvedValue({
      docs: [
        mkDoc('a', '2025-09-08', 30), // latest
        mkDoc('b', '2025-09-07', 20),
        mkDoc('c', '2025-09-06', 10),
      ],
    });

    const resolver = TestBed.inject(DashboardResolver);
    const data = await resolver.resolve();

    // Last session comes from the first doc
    expect(data.lastSession?.id).toBe('a');

    // Totals across fetched set
    expect(data.totals.sessionCount).toBe(3);
    expect(data.totals.minutes).toBe(30 + 20 + 10);

    // Streak: sessions on Mon, Sun, Sat → consecutive days up to today → 3
    expect(data.totals.streakDays).toBe(3);

    // Week is Monday–Sunday; only today's (Mon) minutes are in the current week
    // (Sun 9/07 and Sat 9/06 were previous week)
    const weekSum = Object.values(data.week).reduce((a, b) => a + b, 0);
    expect(weekSum).toBe(30);

    // Ensure we actually used the query helpers (coverage of those call sites)
    expect(collection).toHaveBeenCalledTimes(1);
    expect(orderBy).toHaveBeenCalledWith('date', 'desc');
    expect(limit).toHaveBeenCalledWith(365);
    expect(query).toHaveBeenCalledTimes(1);
    expect(getDocs).toHaveBeenCalledTimes(1);
  });

  it('throws when there is no authed user (authState emits null)', async () => {
    (authState as jest.Mock).mockReturnValue(of(null)); // no user

    const resolver = TestBed.inject(DashboardResolver);

    // filter(Boolean) removes null, take(1) completes empty, firstValueFrom throws EmptyError
    await expect(resolver.resolve()).rejects.toThrow();
    expect(getDocs).not.toHaveBeenCalled();
  });
});
