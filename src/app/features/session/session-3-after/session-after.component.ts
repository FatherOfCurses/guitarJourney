import {Component, OnDestroy, OnInit} from '@angular/core';
import { Observable, Subscription} from 'rxjs';
import {Session} from '../../../models/session';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-session-after',
  templateUrl: './session-after.component.html',
  styleUrls: ['./session-after.component.scss']
})
export class SessionAfterComponent implements OnInit, OnDestroy {
  sessionSubscription: Subscription;
  timerBar: Observable<number>;
  afterSessionForm = this.fb.group({
    sessionReflection:['', [Validators.required]],
    goalForNextTime: ['',[Validators.required]]
  });

  constructor(
    private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.sessionSubscription.unsubscribe();
  }

  onSubmit() {
    this.router.navigate(['']).then();
  }
}
