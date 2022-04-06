import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Session } from '../models/session';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private readonly BASE_URL = 'https://dx471dpyrj.execute-api.us-west-2.amazonaws.com/';
  constructor(private httpClient: HttpClient) { }

  getSession(sessionId: string): Observable<Session[]> {
   return this.httpClient.get<Session[]>(`${this.BASE_URL}/sessions/{sessionId}`);
  }
}


