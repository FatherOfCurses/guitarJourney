import { Component, OnInit } from '@angular/core';
import { Session } from '../../../models/session';
import { SessionService } from '../../../services/session.service';
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import { TableModule } from 'primeng/table';


@Component({
    selector: 'app-previous-sessions',
    templateUrl: './previous-sessions.component.html',
    standalone: true,
    imports: [TableModule]
})
export class PreviousSessionsComponent implements OnInit {
  sessionData: Session[];
  selectedSession: Session;
  constructor(private sessionService: SessionService, private router: Router) { }

  ngOnInit(): void {
    this.sessionService.getAllSessions$().subscribe(session => this.sessionData = session);
  }

  retrieveSessionById(id: string): Observable<Session> {
    return this.sessionService.getSession$(id);
  }

  onRowSelect(event) {
    this.router.navigate(['sessionDetail', event.data.id]);
  }
}
