import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import dayjs from 'dayjs';

@Component({
  selector: 'app-session-before',
  templateUrl: './session-before.component.html',
  styleUrls: ['./session-before.component.scss']
})

export class SessionBeforeComponent implements OnInit {
  today = dayjs(Date.now()).format('YYYY-MM-DD h:m a');
  @Input() sessionForm: FormGroup
  @Output() desiredPracticeTime = new EventEmitter<number>();

  constructor( private fb: FormBuilder, private router: Router) {
  }

  ngOnInit() {
  }

}
