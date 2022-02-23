import { Component, OnInit } from '@angular/core';
import { Session } from '../../models/session';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  // TODO: Save this for view when need to display a date in text format
  // today = dayjs(Date.now()).format('YYYY-MM-DD h:m a');

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.sessionForm = this.fb.group({
      practiceTime: ['', Validators.required],
      whatToPractice: ['', Validators.required],
      sessionIntent: ['', Validators.required]
    });
  }

  populateTimer(event: NbStepChangeEvent): void {
    this.targetPracticeTime = this.sessionForm.get('practiceTime').value;
  }
}
