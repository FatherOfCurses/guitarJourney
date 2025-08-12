import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, Subscription } from "rxjs";
import { Session } from "../models/session";

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private readonly BASE_URL = 'https://dx471dpyrj.execute-api.us-west-2.amazonaws.com';

  constructor(private httpClient: HttpClient) {
  }

  getSession$(sessionId: string): Observable<Session> {
    console.log(`received call to retrieve ${sessionId}`)
   return this.httpClient.get<Session>(`${this.BASE_URL}/sessions/${sessionId}`);
  }

  getAllSessions$(): Observable<Session[]> {
    return this.httpClient.get<Session[]>(`${this.BASE_URL}/sessions`);
  }

  putSession$(session: Session): Observable<Session> {
    console.log(`received call to update session ${session.id}`)
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.put<Session>(`${this.BASE_URL}/sessions`, JSON.stringify(session), {headers});
  }
}
