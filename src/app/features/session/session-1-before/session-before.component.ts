import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {Session} from '../../../models/session';
import {Convertors} from '../../../utilities/Convertors';
import dayjs from 'dayjs';

@Component({
  selector: 'app-session-before',
  templateUrl: './session-before.component.html',
  styleUrls: ['./session-before.component.scss']
})

export class SessionBeforeComponent implements OnInit {

  today = dayjs(Date.now()).format('YYYY-MM-DD h:m a');
  @Input() formSessionRecord: Session = {
    date: '',
    practiceTime: 0,
    whatToPractice: '',
    sessionIntent: ''
  };
  sessionForm = new FormGroup({
    practiceTime: new FormControl('', [Validators.required, Validators.min(1)]),
    whatToPractice: new FormControl('', [Validators.required]),
    sessionIntent: new FormControl('', [Validators.required]),
  });
  @Output() desiredPracticeTime = new EventEmitter<number>();


  constructor(
    private fb: FormBuilder, private router: Router, private converter: Convertors) {
  }

  ngOnInit() {
  }


  onSubmit(): void {
    this.formSessionRecord.date = this.today;
    this.publishTimerStartValue(this.sessionForm.get('practiceTime').value);
    this.formSessionRecord.whatToPractice = this.sessionForm.get('whatToPractice').value;
    this.formSessionRecord.sessionIntent = this.sessionForm.get('sessionIntent').value;
    console.log(`What: ${this.formSessionRecord.whatToPractice} Intent: ${this.formSessionRecord.sessionIntent}`);
    this.router.navigate(['sessionDuring']).then();
  }

  publishTimerStartValue(time: number) {
    this.desiredPracticeTime.emit(time);
  }
}
