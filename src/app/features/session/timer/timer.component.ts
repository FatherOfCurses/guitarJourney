import {Component, OnInit} from '@angular/core';
import {Observable, timer} from 'rxjs';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent {

  startTime: Date;
  stopTime: Date;
  active = false;
  get display() { return (this.startTime && this.stopTime) ? +this.stopTime - +this.startTime : 0 };

  timer() {
    if (this.active) {
      this.stopTime = new Date()
      setTimeout(()=>{
        this.timer();
      }, 1000)
    }
  }

  start() {
    this.startTime = new Date();
    this.active = true;
    this.timer();
  }

  stop() {
    this.stopTime = new Date();
    this.active = false;
  }

}
