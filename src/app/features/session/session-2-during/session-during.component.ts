import { Component, Input, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { SessionComponent} from '../session.component';

@Component({
  selector: 'app-session-during',
  templateUrl: './session-during.component.html',
  styleUrls: ['./session-during.component.scss']
})
export class SessionDuringComponent implements OnInit {
  targetPracticeTime: Date;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  finishSession(): void {
    this.router.navigate(['/sessionAfter']).then();
  }

}
