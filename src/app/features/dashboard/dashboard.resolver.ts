// dashboard.resolver.ts
import { Injectable, inject } from '@angular/core';
import { Resolve } from '@angular/router';
import { collection, Firestore, getDocs, limit, orderBy, query } from '@angular/fire/firestore';
import { Session } from '@models/session';
import { sessionConverter } from '../../storage/converters';
import { Auth, authState } from '@angular/fire/auth';
import { filter, firstValueFrom, take } from 'rxjs';



export interface ViewSession { id: string; startedAt: Date; durationMs: number; }
export interface DashboardData {
  lastSession?: ViewSession;
  totals: { minutes: number; sessionCount: number; streakDays: number; };
  week: Record<string, number>;
}

@Injectable({ providedIn: 'root' })
export class DashboardResolver implements Resolve<DashboardData> {
  private fs = inject(Firestore);
  private auth = inject(Auth);

  async resolve(): Promise<DashboardData> {
    const user = await firstValueFrom(authState(this.auth).pipe(filter(Boolean), take(1)));
    const uid = user!.uid;

    const ref = collection(this.fs, `users/${uid}/sessions`).withConverter(sessionConverter);
    const q = query(ref, orderBy('date', 'desc'), limit(365));
    const snap = await getDocs(q);

    const sessions: ViewSession[] = snap.docs.map(d => {
      const s = d.data() as Session;
      return { id: d.id, startedAt: s.date.toDate(), durationMs: Math.round((s.practiceTime ?? 0) * 60000) };
    });

    const lastSession = sessions[0];
    const minutes = Math.round(sessions.reduce((acc, s) => acc + s.durationMs / 60000, 0));
    const sessionCount = sessions.length;

    // streak + week same as before (omitted here for brevity) ...
    const tz = 'America/New_York';
    const toLocalYmd = (dt: Date) =>
      new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(dt);

    const days = new Set(sessions.map(s => toLocalYmd(s.startedAt)));
    let streakDays = 0;
    let cur = new Date();
    if (days.has(toLocalYmd(cur))) {
      while (days.has(toLocalYmd(cur))) { streakDays++; cur.setUTCDate(cur.getUTCDate() - 1); }
    }

    const week: Record<string, number> = {};
    const startOfWeek = (() => {
      const local = new Date(`${toLocalYmd(new Date())}T00:00:00`);
      const dow = new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: tz }).format(local);
      const idx: any = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      const deltaToMon = ((idx[dow] + 6) % 7);
      const start = new Date(local);
      start.setDate(local.getDate() - deltaToMon);
      return start;
    })();
    for (let i = 0; i < 7; i++) { const d = new Date(startOfWeek); d.setDate(startOfWeek.getDate() + i); week[toLocalYmd(d)] = 0; }
    sessions.forEach(s => { const ymd = toLocalYmd(s.startedAt); if (ymd in week) week[ymd] += Math.round(s.durationMs / 60000); });

    return { lastSession, totals: { minutes, sessionCount, streakDays }, week };
  }
}
