// dashboard/dashboard.resolver.ts
import { Injectable } from '@angular/core';
import { ResolveFn } from '@angular/router';

export interface DashboardData {
  lastSession?: { id: string; startedAt: string; durationMs: number };
  totals: { minutes: number; sessionCount: number; streakDays: number };
  recentMinutes: number[]; // for a tiny sparkline later
}

export const dashboardResolver: ResolveFn<DashboardData> = async () => {
  // TODO: call real APIs. For now, mocked:
  return {
    lastSession: { id: 'abc123', startedAt: new Date().toISOString(), durationMs: 32 * 60_000 },
    totals: { minutes: 1240, sessionCount: 58, streakDays: 5 },
    recentMinutes: [20, 35, 0, 40, 15, 30, 25],
  };
};
