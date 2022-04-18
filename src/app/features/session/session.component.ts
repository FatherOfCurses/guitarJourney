import { Component, OnInit } from '@angular/core';
import { Session } from '../../models/session';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss']
})
export class SessionComponent implements OnInit {
  targetPracticeTime = 0;
  sessionForm: FormGroup;
  timerForm: FormGroup;
  afterForm: FormGroup;
  session: Session;
  // TODO: Save this for view when need to display a date in text format
  // today = dayjs(Date.now()).format('YYYY-MM-DD h:m a');

  constructor(private fb: FormBuilder, private router: Router) {
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.sessionForm = this.fb.group({
      practiceTime: ['', [Validators.required]],
      whatToPractice: ['', [Validators.required]],
      sessionIntent: ['', [Validators.required]],
    });
    this.timerForm = this.fb.group({
      time: [''],
    });
    this.afterForm = this.fb.group({
      sessionReflection:['', [Validators.required]],
      goalForNextTime: ['',[Validators.required]]
    });
  }

  setTimer(): void {
    this.timerForm.get('time').setValue(this.sessionForm.get('practiceTime').value);
  }

  onSubmit(): void {
    console.log(this.afterForm.get('sessionReflection'));
    this.router.navigate(['dashboard']).then();
  }
}
