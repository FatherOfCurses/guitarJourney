import {Component, OnInit} from '@angular/core';
import { TimerComponent } from './timer/timer.component';
import { SessionBeforeComponent } from './session-1-before/session-before.component';
import { SessionDuringComponent } from './session-2-during/session-during.component';
import { SessionAfterComponent } from './session-3-after/session-after.component';


@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss']
})
export class SessionComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
