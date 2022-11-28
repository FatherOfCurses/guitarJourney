import { Component, OnInit } from "@angular/core";
import { Session } from '../../../models/session';
import { SessionService } from '../../../services/session.service';

@Component({
  selector: 'app-previous-sessions',
  templateUrl: './previous-sessions.component.html',
  styleUrls: ['./previous-sessions.component.scss']
})
export class PreviousSessionsComponent implements OnInit {
  sessionData: Session[] = [
    {
      id:'Id',
      date: '2022-10-22',
      practiceTime: 20,
      whatToPractice: 'stuff',
      sessionIntent: 'morestuff',
      postPracticeReflection: 'reflect',
      goalForNextTime: 'do better'
    },
    {
      id:'Id1',
      date: '2022-10-23',
      practiceTime: 21,
      whatToPractice: 'stuff1',
      sessionIntent: 'morestuff1',
      postPracticeReflection: 'reflect1',
      goalForNextTime: 'do better1'
    },
  ];
  constructor(private sessionService: SessionService) { }

  ngOnInit(): void {
    this.sessionService.getAllSessions$().subscribe(session => this.sessionData = session);
  }
}
