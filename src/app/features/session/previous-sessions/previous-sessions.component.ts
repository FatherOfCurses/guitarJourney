import { Component, OnInit } from '@angular/core';
import { Session } from '../../../models/session';
import { SessionService } from '../../../services/session.service';
import { Observable } from "rxjs";
import { Message, MessageService } from "primeng/api";
import { ToastModule } from "primeng/toast";
import { Router } from '@angular/router';


@Component({
  selector: 'app-previous-sessions',
  templateUrl: './previous-sessions.component.html',
  styleUrls: ['./previous-sessions.component.scss'],
  providers: [ MessageService ]
})
export class PreviousSessionsComponent implements OnInit {
  sessionData: Session[];
  selectedSession: Session;
  constructor(private sessionService: SessionService, private router: Router, private messageService: MessageService) { }

  ngOnInit(): void {
    this.sessionService.getAllSessions$().subscribe(session => this.sessionData = session);
  }

  retrieveSessionById(id: string): Observable<Session> {
    return this.sessionService.getSession$(id);
  }

  onRowSelect(event) {
    console.log('navigate to', event.data.id)
    this.router.navigate(['sessionDetail']);
  }
}
