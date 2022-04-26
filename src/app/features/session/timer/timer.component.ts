import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CdTimerModule} from 'angular-cd-timer';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent {

  @Input() goalTime: number;
  @Output() finishTime: EventEmitter<number>;
  @Output() sessionFinished: EventEmitter<boolean>;

  markFinished(): void {
    this.finishTime.emit(900);
    this.sessionFinished.emit(true);
  }

}
