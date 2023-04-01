import { Component, OnInit } from '@angular/core';
import * as metronome from '../../../../node_modules/metronome/assets/js/metronome'

@Component({
  selector: 'app-metronome',
  templateUrl: './metronome.component.html',
  styleUrls: ['./metronome.component.scss']
})
export class MetronomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    metronome.play();
  }

}
