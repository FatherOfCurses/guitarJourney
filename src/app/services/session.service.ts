import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, Subscription } from "rxjs";
import { Session } from "../models/session";
import { Convertors } from "../utilities/Convertors";

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private readonly BASE_URL = 'https://dx471dpyrj.execute-api.us-west-2.amazonaws.com';

  constructor(private httpClient: HttpClient, private convertor: Convertors) {
  }

  getSession$(sessionId: string): Observable<Session> {
    console.log(`received call to retrieve ${sessionId}`)
   return this.httpClient.get<Session>(`${this.BASE_URL}/sessions/${sessionId}`);
  }

  getAllSessions$(): Observable<Session[]> {
    return this.httpClient.get<Session[]>(`${this.BASE_URL}/sessions`);
  }

  putSession$(session: Session): Subscription {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    session.date = this.convertor.transformDate(session.date);
    return this.httpClient
      .put(`${this.BASE_URL}/sessions`, JSON.stringify(session), {responseType: 'text', headers})
      .subscribe(
        res => console.log(`put result: success`),
        err => console.log(`Error with put result: ${err.message}`)
      );
  }
}
