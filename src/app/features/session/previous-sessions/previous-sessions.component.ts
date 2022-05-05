import { Component, OnInit } from '@angular/core';
import { Session } from '../../../models/session';
import { SessionService } from '../../../services/session.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-previous-sessions',
  templateUrl: './previous-sessions.component.html',
  styleUrls: ['./previous-sessions.component.scss']
})
export class PreviousSessionsComponent implements OnInit {
  sessionData: Session[];
  dataSource: MatTableDataSource<Session> = new MatTableDataSource();
  displayedColumns = ['date','practiceTime','whatToPractice', 'sessionIntent','postPracticeReflection','goalForNextTime'];
  constructor(private sessionService: SessionService) { }

  ngOnInit(): void {
    this.sessionService.getAllSessions$().subscribe(
      data => {
      this.dataSource = new MatTableDataSource(data);
    });
}
}
