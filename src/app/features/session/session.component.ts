import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Session } from '../../models/session';
import { SessionBeforeComponent } from './session-1-before/session-before.component';

import { Convertors } from '../../utilities/Convertors';
import dayjs from 'dayjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { NbStepChangeEvent } from '@nebular/theme';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss']
})
export class SessionComponent implements OnInit {
  changeEvent: NbStepChangeEvent;


  targetPracticeTime = 0;
  sessionForm: FormGroup;
  session: Session;
  sessionStarted = false;
  sessionFinished = false;
  // TODO: Save this for view when need to display a date in text format
  // today = dayjs(Date.now()).format('YYYY-MM-DD h:m a');

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.sessionForm = this.fb.group({
      practiceTime: '',
      whatToPractice: '',
      sessionIntent: ''
    });
    }

    populateTimer(targetTime: number): void {
    this.targetPracticeTime = targetTime;
  }

  handleStepChange(event: NbStepChangeEvent): void {
    this.changeEvent = event;
  }

}
