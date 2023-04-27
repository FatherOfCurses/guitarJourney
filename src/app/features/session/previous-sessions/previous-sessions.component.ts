import { Component, OnInit } from "@angular/core";
import { Session } from '../../../models/session';
import { SessionService } from '../../../services/session.service';
import { Observable } from "rxjs";

@Component({
  selector: 'app-previous-sessions',
  templateUrl: './previous-sessions.component.html',
  styleUrls: ['./previous-sessions.component.scss']
})
export class PreviousSessionsComponent implements OnInit {
  sessionData: Session[];
  constructor(private sessionService: SessionService) { }

  ngOnInit(): void {
    this.sessionService.getAllSessions$().subscribe(session => this.sessionData = session);
  }

  retrieveSessionById(id: string): Observable<Session> {
    return this.sessionService.getSession$(id);
  }
}
