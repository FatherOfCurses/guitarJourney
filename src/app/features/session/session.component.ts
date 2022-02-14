import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Session } from '../../models/session';
import { SessionBeforeComponent } from './session-1-before/session-before.component';

import { Convertors } from '../../utilities/Convertors';
import dayjs from 'dayjs';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss']
})
export class SessionComponent implements OnInit {
  practiceTime: number;
  session: Session;
  // TODO: Save this for view when need to display a date in text format
  // today = dayjs(Date.now()).format('YYYY-MM-DD h:m a');

  constructor(private convertor: Convertors) { }

  ngOnInit(): void {
  }

}
