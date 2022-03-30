import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-session-after',
  templateUrl: './session-after.component.html',
  styleUrls: ['./session-after.component.scss']
})
export class SessionAfterComponent implements OnInit, OnDestroy {
  @Input() sessionForm: FormGroup;
  sessionSubscription: Subscription;
  timerBar: Observable<number>;

  constructor(
    private fb: FormBuilder, private router: Router) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.sessionSubscription.unsubscribe();
  }

  onSubmit() {
    this.router.navigate(['dashboard']).then();
  }
}
