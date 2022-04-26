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
  @Output() finishTime: EventEmitter<number>;
  @Output() sessionFinished: EventEmitter<boolean>;

  ngOnInit() {
  }

  start(): void {
      this.timer.start();
    }

  markFinished(): void {
    this.timer.stop();
    const timeValue = this.timer.seconds;
    console.log(`time: ${timeValue}`)
    this.sessionFinished.emit(true);
  }
}
