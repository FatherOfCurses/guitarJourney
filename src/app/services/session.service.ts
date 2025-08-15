import { Injectable, InjectionToken, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Session } from '../models/session';

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  providedIn: 'root',
  factory: () => 'https://dx471dpyrj.execute-api.us-west-2.amazonaws.com',
});

@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  getSession$(sessionId: string): Observable<Session> {
    // Prefer a real logger in production; remove noisy console logs
    return this.http.get<Session>(`${this.baseUrl}/sessions/${sessionId}`);
  }

  getAllSessions$(): Observable<Session[]> {
    return this.http.get<Session[]>(`${this.baseUrl}/sessions`);
  }

  putSession$(session: Session): Observable<Session> {
    return this.http.put<Session>(
      `${this.baseUrl}/sessions`,
      session,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    );
  }
}
