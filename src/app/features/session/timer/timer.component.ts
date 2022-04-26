import {
  AfterContentChecked,
  AfterContentInit,
  AfterViewChecked,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { CdTimerComponent} from 'angular-cd-timer';

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
    this.timer.reset();
  }

  start(): void {
      this.timer.start();
    }

  markFinished(): void {
    this.finishTime.emit(900);
    this.sessionFinished.emit(true);
  }
}
