import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { CdTimerModule } from "angular-cd-timer";

@Component({
  selector: 'app-session-timer',
  templateUrl: './session-timer.component.html',
  styleUrls: ['./session-timer.component.scss']
})
export class SessionTimerComponent implements OnInit {
  @ViewChild('sessionTimer') timer;
  @Input() goalTime: number;
  @Output() finishTime = new EventEmitter<number>();

  ngOnInit() {
    this.finishTime.emit(0);
  }

  start(): void {
      this.timer.start();
    }

  markFinished(): void {
    this.timer.stop();
    const endTimeValue = (this.timer.minutes + (this.timer.seconds / 60));
    console.log(`time: ${endTimeValue}`);
    this.finishTime.emit(endTimeValue);
  }
}
