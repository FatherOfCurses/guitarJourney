import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {Router} from '@angular/router';
import { SessionComponent} from '../session.component';

@Component({
  selector: 'app-session-during',
  templateUrl: './session-during.component.html',
  styleUrls: ['./session-during.component.scss']
})
export class SessionDuringComponent implements OnInit {
  @Input() targetPracticeTime: number;
  @Output() totalPracticeTime: EventEmitter<number>;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  finishSession(): void {
    this.totalPracticeTime.emit()
    // this.router.navigate(['/sessionAfter']).then();
  }

}
