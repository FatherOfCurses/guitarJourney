import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-session-after',
  templateUrl: './session-after.component.html',
  styleUrls: ['./session-after.component.scss']
})
export class SessionAfterComponent implements OnInit, OnDestroy {
  sessionSubscription: Subscription;
  timerBar: Observable<number>;

  constructor(
    private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.sessionSubscription.unsubscribe();
  }

  onSubmit() {
    this.router.navigate(['dashboard']).then();
  }
}
