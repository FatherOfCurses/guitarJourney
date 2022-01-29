import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Session } from '../../models/session';
import { SessionBeforeComponent } from './session-1-before/session-before.component';

import { Convertors } from '../../utilities/Convertors';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss']
})
export class SessionComponent implements OnInit {
  @Input() practiceTime: number;
  timerStartValue: Date;
  sessionRecord: Session = {
    date: '',
    practiceTime: 0,
    whatToPractice: '',
    sessionIntent: ''
  };

  constructor(private convertor: Convertors) { }

  ngOnInit(): void {}

  setTimerStartValue(practiceTime: number) {
    this.timerStartValue = this.convertor.convertNumberToTimeValue(practiceTime);
  }
}
