import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {Session} from '../../../models/session';
import dayjs from 'dayjs';

@Component({
  selector: 'app-session-before',
  templateUrl: './session-before.component.html',
  styleUrls: ['./session-before.component.scss']
})

export class SessionBeforeComponent implements OnInit {
  sessionForm: FormGroup;
  today = dayjs(Date.now()).format('YYYY-MM-DD h:m a');
  @Output() desiredPracticeTime = new EventEmitter<number>();

  constructor( private fb: FormBuilder, private router: Router) {
  }

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm(): void {
    this.sessionForm = this.fb.group({
      practiceTime: '',
      whatToPractice: '',
      sessionIntent: ''
    })
  }

  onSubmit(): void {
    console.log(this.sessionForm)
  }

}
