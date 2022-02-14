import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent {

  @Input() goalTime: number;
  @Output() finishTime: EventEmitter<number>;
  @Output() sessionFinished: EventEmitter<boolean>;
  endTime = 600;

  markFinished(): void {
    this.finishTime.emit(900);
    this.sessionFinished.emit(true);
  }

}
