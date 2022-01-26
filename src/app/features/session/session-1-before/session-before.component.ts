import { Component, OnDestroy, OnInit, Output } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
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
  sessionForm = this.fb.group({
    practiceTime: ['', [Validators.required, Validators.min(1)]],
    whatToPractice: ['', [Validators.required]],
    sessionIntent: ['', [Validators.required]],
  });
  sessionRecord: Session = {
    date: '',
    practiceTime: 0,
    whatToPractice: '',
    sessionIntent: ''
  };
  @Output() desiredPracticeTime: Date;

  constructor(
    private fb: FormBuilder, private router: Router) {
  }

  ngOnInit() {
  }

  onSubmit(): void {
    this.sessionRecord.date = this.today;
    this.sessionRecord.practiceTime = this.sessionForm.value.practiceTime;
    this.sessionRecord.whatToPractice = this.sessionForm.value.whatToPractice;
    this.sessionRecord.sessionIntent = this.sessionForm.value.sessionIntent;
    this.router.navigate(['sessionDuring']).then();
  }
}
