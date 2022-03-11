import { Component, Input, OnInit } from '@angular/core';
import { SVGuitarChord } from 'svguitar';
import { ChordObject } from '../../../models/chord';

@Component({
  selector: 'app-chord.ts',
  templateUrl: './chord.component.html',
  styleUrls: ['./chord.component.scss']
})
export class ChordComponent implements OnInit {
  @Input() chord: ChordObject;

  constructor() {}

  ngOnInit(): void {
    const chart = new SVGuitarChord('#chart')
    chart
        .configure({
        strings: 6,
        frets: 4,
        position: 1,
        tuning: [ 'E', 'A', 'D', 'G', 'B', 'E' ],
        fretLabelFontSize: 38,
        tuningsFontSize: 28,
        nutSize: 0.65,
        nutColor: '#000',
        nutTextColor: '#FFF',
        nutTextSize: 22,
        nutStrokeColor: '#000000',
        nutStrokeWidth: 0,
        barreChordStrokeColor: '#000000',
        barreChordStrokeWidth: 0,
        fretSize: 1.5,
        sidePadding: 0.2,
        fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
        title: 'F# minor',
        titleFontSize: 48,
        titleBottomMargin: 0,
        color: '#000000',
        backgroundColor: 'none',
        barreChordRadius: 0.25,
        emptyStringIndicatorSize: 0.6,
        strokeWidth: 2,
        topFretWidth: 10,
        titleColor: '#000000',
        stringColor: '#000000',
        fretLabelColor: '#000000',
        tuningsColor: '#000000',
        fretColor: '#000000',
        fixedDiagramPosition: false
      })
      .chord({
        // array of [string, fret, text | options]
        fingers: [
          [1, 2, '2'],
          [2, 3, { text: '3', color: '#F00' }],
          [3, 3],
          [6, 'x']
        ],
        barres: [
          { fromString: 5, toString: 1, fret: 1, text: '1', color: '#0F0', textColor: '#F00' },
        ],
        title: 'F# minor',
        position: 2,
      })
      .draw();
  }
}
