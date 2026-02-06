import { Component, Input, OnInit } from '@angular/core';
import { SVGuitarChord } from 'svguitar';
import { ChordObject } from '../../../models/chord';

@Component({
    selector: 'app-chord.ts',
    templateUrl: './chord.component.html',
    standalone: false
})
export class ChordComponent implements OnInit {

  constructor(private chord: ChordObject) {}

  ngOnInit(): void {
    // const chordChart = new SVGuitarChord('#chord')
    // chordChart
    //     .configure({
    //       ...this.chord.configure
    //   })
    //   .chord({
    //     fingers: [
    //       [1,2],
    //       [2,3],
    //       [3,3],
    //       [6, 'x']
    //     ],
    //     title: 'F# minor',
    //     position: 2,
    //     barres: []
    //   })
    //   .draw();
  }
}
