import {Component, OnInit} from '@angular/core';
import { Session } from '../../models/session';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss']
})
export class SessionComponent implements OnInit {

  sessionRecord: Session = {
    date: '',
    practiceTime: 0,
    whatToPractice: '',
    sessionIntent: ''
  };
  sessionTargetTime: Date;

  constructor() { }

  ngOnInit(): void {
  }

}
