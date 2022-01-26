import { Component, Input, OnDestroy, OnInit, Output } from '@angular/core';
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
    practiceTime: new FormControl([this.formSessionRecord.practiceTime, [Validators.required, Validators.min(1)]]),
    whatToPractice: new FormControl([this.formSessionRecord.whatToPractice, [Validators.required]]),
    sessionIntent: new FormControl([this.formSessionRecord.sessionIntent, [Validators.required]]),
  });
  @Output() desiredPracticeTime: Date;

  constructor(
    private fb: FormBuilder, private router: Router, private converter: Convertors) {
  }

  ngOnInit() {
  }

  onSubmit(): void {
    this.formSessionRecord.date = this.today;
    this.desiredPracticeTime = this.converter.convertNumberToTimeValue(1);
    this.router.navigate(['sessionDuring']).then();
  }
}
