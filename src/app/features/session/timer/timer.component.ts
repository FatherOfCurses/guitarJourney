import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit {
  @ViewChild('sessionTimer') timer;
  @Input() goalTime: number;
  @Output() finishTime = new EventEmitter<number>();

  ngOnInit() {
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
